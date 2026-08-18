import http from "http";
import { execFile, spawn, type ChildProcess } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { promisify } from "util";
import { createSocket, type Socket } from "dgram";
import { type AddressInfo } from "net";
import dns from "dns";
import { WebSocketServer, WebSocket } from "ws";
import {
  MediaStream,
  MediaStreamTrack,
  RTCPeerConnection,
  useOPUS,
  useH264,
  type RTCDataChannel,
} from "werift";
import { RtpPacket } from "werift/nonstandard";
import { H264Packetizer } from "./h264-packetizer.js";
import {
  findStartCode,
  getStartCodeLength,
  isFirstSliceInPicture,
} from "./h264-annexb.js";
import { InputDispatcher } from "./x11-input.js";
import { RtpPacer } from "./rtp-pacer.js";

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;
const SCREEN_FPS = 30;
const RTP_CLOCK_RATE = 90000;
const TIMESTAMP_STEP = RTP_CLOCK_RATE / SCREEN_FPS;
const ICE_ADVERTISE_HOST = process.env.ICE_ADVERTISE_HOST || "127.0.0.1";
const START_URL = process.env.RUNTIME_START_URL || "chrome://newtab";
const ENABLE_GPU = process.env.RUNTIME_ENABLE_GPU === "1";
const VIDEO_ENCODER = process.env.VIDEO_ENCODER || (ENABLE_GPU ? "h264_nvenc" : "libx264");
const ADVERTISE_SERVER_REFLEXIVE_CANDIDATE = process.env.ICE_ADVERTISE_SRFLX === "1";
const APP_COMMAND = process.env.APP_COMMAND || "chromium";
const APP_EXECUTABLE = process.env.APP_EXECUTABLE || APP_COMMAND;
const APP_WINDOW_CLASS = process.env.APP_WINDOW_CLASS || "chromium";
const APP_EXTRA_ARGS = process.env.APP_EXTRA_ARGS ? process.env.APP_EXTRA_ARGS.split(",") : [];
const execFileAsync = promisify(execFile);
const pulseEnv = {
  ...process.env,
  HOME: process.env.HOME || "/home/infinity",
  XDG_RUNTIME_DIR: process.env.XDG_RUNTIME_DIR || "/tmp/runtime-infinity",
};
let pulseAudioSource = process.env.PULSE_AUDIO_SOURCE || "auto_null.monitor";
let desktopReady = false;

const icePortRange = ((): [number, number] | undefined => {
  const min = Number(process.env.ICE_PORT_MIN || "0");
  const max = Number(process.env.ICE_PORT_MAX || "0");
  return min > 0 && max > min ? [min, max] : undefined;
})();

const log = (...args: unknown[]): void => {
  console.log(`[agent]`, ...args);
};

// ---------------------------------------------------------------------------
// X server + chromium
// ---------------------------------------------------------------------------

function waitForXServer(timeoutMs = 15000): Promise<void> {
  const socketPath = "/tmp/.X11-unix/X99";
  return new Promise((resolve) => {
    const started = Date.now();
    const timer = setInterval(() => {
      if (existsSync(socketPath)) {
        clearInterval(timer);
        setTimeout(resolve, 500);
      } else if (Date.now() - started > timeoutMs) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
}

function startDisplay(): void {
  spawn(
    "Xvfb",
    [":99", "-screen", "0", `${SCREEN_WIDTH}x${SCREEN_HEIGHT}x24`, "-ac", "-nolisten", "tcp"],
    { stdio: "ignore" },
  );
}

async function waitForAppWindow(timeoutMs = 15000): Promise<void> {
  const started = Date.now();
  const env = { ...pulseEnv, DISPLAY: ":99" };
  while (Date.now() - started < timeoutMs) {
    try {
      await execFileAsync("xdotool", ["search", "--onlyvisible", "--class", APP_WINDOW_CLASS], { env });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`${APP_COMMAND} window did not become visible`);
}

async function startDesktopApp(): Promise<void> {
  const env = { ...pulseEnv, DISPLAY: ":99", PULSE_SINK: "auto_null" };
  const gpuArgs = ENABLE_GPU
    ? ["--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--use-gl=egl"]
    : ["--disable-gpu"];
  spawn("fluxbox", [], { env, stdio: "ignore" });

  let appArgs: string[];
  if (APP_COMMAND === "chromium") {
    appArgs = [
      "--disable-dev-shm-usage",
      ...gpuArgs,
      "--window-size=1280,720",
      "--window-position=0,0",
      "--start-maximized",
      "--no-first-run",
      "--no-default-browser-check",
      "--autoplay-policy=no-user-gesture-required",
      START_URL,
    ];
  } else if (APP_COMMAND === "code") {
    appArgs = [
      "--no-sandbox",
      ...gpuArgs,
      "--force-device-scale-factor=1",
      "--max-old-space-size=4096",
      ...APP_EXTRA_ARGS,
    ];
  } else {
    appArgs = [...APP_EXTRA_ARGS];
  }

  const app = spawn(APP_EXECUTABLE, appArgs, { env, stdio: ["ignore", "pipe", "pipe"] });
  app.stdout?.on("data", (data) => log(`[${APP_COMMAND} stdout]`, data.toString().trim()));
  app.stderr?.on("data", (data) => log(`[${APP_COMMAND} stderr]`, data.toString().trim()));
  app.on("error", (error) => log(`${APP_COMMAND} failed to start:`, error.message));
  app.on("exit", (code, signal) => log(`${APP_COMMAND} exited:`, code, signal));
  await waitForAppWindow();
}

function getVideoEncoderArgs(): string[] {
  if (VIDEO_ENCODER === "h264_nvenc") {
    return [
      "-c:v", "h264_nvenc",
      "-preset", "p1",
      "-tune", "ll",
      "-rc", "cbr",
      "-b:v", "6M",
      "-maxrate", "6M",
      "-bufsize", "1M",
    ];
  }
  return [
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-tune", "zerolatency",
    "-b:v", "4M",
    "-maxrate", "6M",
    "-bufsize", "1M",
  ];
}

async function startPulseAudio(): Promise<void> {
  mkdirSync(pulseEnv.XDG_RUNTIME_DIR!, { recursive: true });
  try {
    await execFileAsync("pulseaudio", ["--start", "--exit-idle-time=-1"], {
      env: pulseEnv,
    });
  } catch (error) {
    log("PulseAudio start warning:", error instanceof Error ? error.message : error);
  }

  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      const { stdout } = await execFileAsync("pactl", ["get-default-source"], {
        env: pulseEnv,
      });
      const source = stdout.trim();
      if (source) {
        pulseAudioSource = source;
        log("PulseAudio monitor:", pulseAudioSource);
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  log("PulseAudio monitor unavailable; audio will be silent");
}

// ---------------------------------------------------------------------------
// H264 source: ffmpeg x11grab -> Annex-B -> RTP packets
// ---------------------------------------------------------------------------

class H264Source {
  private ffmpeg: ChildProcess | null = null;
  private packetizer: H264Packetizer | null = null;
  private readonly pacer: RtpPacer;
  private buf = Buffer.alloc(0);
  private pendingNalus: Buffer[] = [];
  private pendingHasVcl = false;
  private rtpTimestamp = (Math.random() * 0xffffffff) >>> 0;
  private restarting = false;
  private restartTimer: ReturnType<typeof setTimeout> | null = null;

  private lastKeyframeRequestTime = 0;

  constructor(
    private readonly track: MediaStreamTrack,
    sendRtp: (packet: RtpPacket) => Promise<void>,
  ) {
    this.pacer = new RtpPacer(
      sendRtp,
      () => this.requestKeyframe(),
      undefined,
      () => this.requestKeyframe(),
    );
  }

  start(): void {
    if (this.ffmpeg) return;
    const proc = spawn(
      "ffmpeg",
      [
        "-loglevel", "error",
        "-nostdin",
        "-f", "x11grab",
        "-video_size", `${SCREEN_WIDTH}x${SCREEN_HEIGHT}`,
        "-framerate", String(SCREEN_FPS),
        "-i", ":99.0",
         ...getVideoEncoderArgs(),
        "-profile:v", "baseline",
         "-pix_fmt", "yuv420p",
          "-g", "30",
          "-keyint_min", "30",
         "-bf", "0",
         "-aud", "1",
         ...(VIDEO_ENCODER === "h264_nvenc"
           ? []
           : ["-x264-params", "aud=1:repeat-headers=1"]),
         "-f", "h264",
        "pipe:1",
      ],
      { env: { ...process.env, DISPLAY: ":99" }, stdio: ["ignore", "pipe", "inherit"] },
    );
    this.ffmpeg = proc;
    proc.stdout?.on("data", (chunk: Buffer) => {
      this.buf = Buffer.concat([this.buf, chunk]);
      this.scan();
    });
    proc.on("exit", () => {
      // An older process can exit after a PLI restart has already spawned its
      // replacement. It must not clear the replacement's state.
      if (this.ffmpeg !== proc) return;
      log("ffmpeg exited");
      this.ffmpeg = null;
      this.buf = Buffer.alloc(0);
    });
    log("ffmpeg h264 encoder started");
  }

  stop(cancelRestart = true): void {
    if (cancelRestart && this.restartTimer !== null) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
      this.restarting = false;
    }
    this.ffmpeg?.stdout?.removeAllListeners();
    this.ffmpeg?.kill("SIGTERM");
    this.ffmpeg = null;
    this.buf = Buffer.alloc(0);
    this.pendingNalus = [];
    this.pendingHasVcl = false;
    this.pacer.clear();
  }

  requestKeyframe(): void {
    if (this.restarting || !this.ffmpeg) return;

    const now = Date.now();
    if (now - this.lastKeyframeRequestTime < 2000) {
      log("PLI received, ignoring due to cooldown");
      return;
    }
    this.lastKeyframeRequestTime = now;

    log("PLI received, restarting encoder for keyframe");
    this.restarting = true;
    this.stop(false);
    this.restartTimer = setTimeout(() => {
      this.restartTimer = null;
      this.restarting = false;
      this.start();
    }, 200);
  }

  private scan(): void {
    for (;;) {
      const sc = findStartCode(this.buf, 0);
      if (sc === -1) {
        this.keepTail(3);
        return;
      }
      // A 4-byte start code is 00 00 00 01. Checking byte +3 is wrong for
      // 3-byte codes because that byte is already the NAL header and can be
      // 0x01 for a perfectly valid non-IDR slice.
      const scLen = getStartCodeLength(this.buf, sc);
      const naluStart = sc + scLen;
      if (naluStart >= this.buf.length) {
        this.keepTail(this.buf.length - sc);
        return;
      }
      const next = findStartCode(this.buf, naluStart);
      if (next === -1) {
        // Keep the start code too. The next stdout chunk may contain the
        // remainder of this NAL followed by its next start code.
        // Dropping it silently loses every NAL split across chunks.
        this.keepTail(this.buf.length - sc);
        return;
      }
      const nalu = Buffer.from(this.buf.subarray(naluStart, next));
      if (nalu.length > 0) this.handleNalu(nalu);
      this.buf = this.buf.subarray(next);
    }
  }

  private keepTail(length: number): void {
    if (this.buf.length > length) {
      this.buf = Buffer.from(this.buf.subarray(this.buf.length - length));
    }
  }

  private handleNalu(nalu: Buffer): void {
    const type = nalu[0]! & 0x1f;
    if (type === 9) {
      // AUD: access unit delimiter -> frame boundary
      if (this.pendingNalus.length > 0) {
        this.emitFrame();
        this.pendingNalus = [];
      }
      this.pendingHasVcl = false;
      return;
    }
    if (type === 6) return; // drop SEI

    // AUD is enabled for the encoders above, but some FFmpeg builds do not
    // preserve it for every output mode. VCL slice headers still provide a
    // reliable picture boundary fallback, preventing all frames from being
    // held in pendingNalus when AUD is absent.
    if (
      (type === 1 || type === 5) &&
      this.pendingHasVcl &&
      isFirstSliceInPicture(nalu) === true
    ) {
      this.emitFrame();
      this.pendingNalus = [];
      this.pendingHasVcl = false;
    }
    this.pendingNalus.push(nalu);
    if (type === 1 || type === 5) this.pendingHasVcl = true;
  }

  private emitFrame(): void {
    const nalus = this.pendingNalus;
    if (nalus.length === 0) return;
    if (!this.packetizer) {
      this.packetizer = new H264Packetizer(this.track.codec?.payloadType ?? 96);
    }
    const packets = this.packetizer.packetizeNalus(nalus, this.rtpTimestamp);
    this.pacer.enqueueFrame(packets);
    this.rtpTimestamp = (this.rtpTimestamp + TIMESTAMP_STEP) >>> 0;
  }
}

class OpusSource {
  private ffmpeg: ChildProcess | null = null;
  private socket: Socket | null = null;

  constructor(
    private readonly sendRtp: (packet: RtpPacket) => Promise<void>,
  ) {}

  async start(): Promise<void> {
    if (this.ffmpeg) return;

    const socket = createSocket("udp4");
    this.socket = socket;
    socket.on("message", (packet) => {
      try {
        void this.sendRtp(RtpPacket.deSerialize(packet)).catch((error) => {
          log("Opus RTP send failed:", error instanceof Error ? error.message : error);
        });
      } catch (error) {
        log("invalid Opus RTP packet:", error instanceof Error ? error.message : error);
      }
    });
    await new Promise<void>((resolve, reject) => {
      socket.once("error", reject);
      socket.bind(0, "127.0.0.1", () => {
        socket.removeListener("error", reject);
        resolve();
      });
    });

    const port = (socket.address() as AddressInfo).port;
    const proc = spawn(
      "ffmpeg",
      [
        "-loglevel", "error",
        "-nostdin",
        "-f", "pulse",
        "-i", pulseAudioSource,
        "-ac", "2",
        "-ar", "48000",
        "-c:a", "libopus",
        "-application", "lowdelay",
        "-frame_duration", "20",
        "-b:a", "128k",
        "-f", "rtp",
        "-payload_type", "111",
        `rtp://127.0.0.1:${port}?pkt_size=1200`,
      ],
      { env: pulseEnv, stdio: ["ignore", "ignore", "inherit"] },
    );
    this.ffmpeg = proc;
    proc.on("exit", () => {
      this.ffmpeg = null;
      this.socket?.close();
      this.socket = null;
      log("ffmpeg Opus encoder exited");
    });
    log("ffmpeg Opus encoder started");
  }

  stop(): void {
    this.ffmpeg?.kill("SIGTERM");
    this.ffmpeg = null;
    this.socket?.close();
    this.socket = null;
  }
}

// ---------------------------------------------------------------------------
// Signaling + WebRTC session
// ---------------------------------------------------------------------------

let activePc: RTCPeerConnection | null = null;
let activeWs: WebSocket | null = null;
let activeTrack: MediaStreamTrack | null = null;
let activeAudioTrack: MediaStreamTrack | null = null;
let encoder: H264Source | null = null;
let audioEncoder: OpusSource | null = null;
const pendingCandidates: unknown[] = [];
let remoteDescriptionReady = false;
const inputDispatcher = new InputDispatcher();

function send(ws: WebSocket, message: unknown): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

const mdnsCache = new Map<string, string>();

// Chrome obfuscates its host candidates as mDNS names (xxx.local).
// Resolve them via the OS mDNS client so ICE can reach the browser.
function resolveMdns(name: string): Promise<string | null> {
  const cached = mdnsCache.get(name);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    dns.lookup(name, { family: 4 }, (error, address) => {
      if (error || !address) {
        resolve(null);
        return;
      }
      mdnsCache.set(name, address);
      setTimeout(() => mdnsCache.delete(name), 60_000);
      resolve(address);
    });
  });
}

interface RemoteCandidateMessage {
  candidate?: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
}

async function handleRemoteCandidate(candidate: RemoteCandidateMessage): Promise<void> {
  const line = candidate.candidate || "";
  log("remote candidate:", line.split(" ").slice(0, 9).join(" "));
  let final = candidate;
  const parts = line.split(" ");
  const address = parts[4];
  if (address?.endsWith(".local")) {
    const resolved = await resolveMdns(address);
    if (resolved) {
      parts[4] = resolved;
      final = { ...candidate, candidate: parts.join(" ") };
      log("mDNS resolved:", address, "->", resolved);
    }
  }
  // Candidates commonly arrive before setRemoteDescription() completes. Do
  // not discard them: the browser needs all of them for a stable ICE path.
  if (!activePc || !remoteDescriptionReady) {
    pendingCandidates.push(final);
    return;
  }
  await activePc.addIceCandidate(final as never).catch(() => undefined);
}

function closeSession(): void {
  const previousWs = activeWs;
  activeWs = null;
  remoteDescriptionReady = false;
  encoder?.stop();
  encoder = null;
  audioEncoder?.stop();
  audioEncoder = null;
  activeTrack?.stop();
  activeTrack = null;
  activeAudioTrack?.stop();
  activeAudioTrack = null;
  activePc?.close();
  activePc = null;
  pendingCandidates.length = 0;
  if (previousWs?.readyState === WebSocket.OPEN) previousWs.close();
}

function dispatchInput(message: unknown): void {
  if (!message || typeof message !== "object") return;
  const msg = message as { type?: string };
  if (msg.type === "ping") return;
  inputDispatcher.dispatch(message as never);
}

function setupDataChannel(dc: RTCDataChannel): void {
  log("data channel opened:", dc.label);
  dc.onMessage.subscribe((data) => {
    let message: unknown;
    try {
      message = JSON.parse(String(data));
    } catch {
      return;
    }
    if (!message || typeof message !== "object") return;
    const msg = message as { type?: string; t?: number };
    if (msg.type === "ping") {
      dc.send(JSON.stringify({ type: "pong", t: msg.t }));
      return;
    }
    dispatchInput(message);
  });
}

async function handleOffer(ws: WebSocket, sdp: string): Promise<void> {
  closeSession();
  activeWs = ws;
  log("received offer");

  const pc = new RTCPeerConnection({
    codecs: { video: [useH264()], audio: [useOPUS()] },
    iceServers: [],
    iceUseTcp: false,
    iceUseIpv6: false,
    ...(icePortRange ? { icePortRange } : {}),
  });
  activePc = pc;

  // Keep callbacks tied to this peer connection. A closed connection can
  // finish emitting state/PLI events after a reconnect has already created a
  // new global encoder.
  let sessionEncoder: H264Source | null = null;
  let sessionAudioEncoder: OpusSource | null = null;
  const stopSessionMedia = () => {
    const currentEncoder = sessionEncoder;
    const currentAudioEncoder = sessionAudioEncoder;
    sessionEncoder = null;
    sessionAudioEncoder = null;
    currentEncoder?.stop();
    currentAudioEncoder?.stop();
    if (encoder === currentEncoder) encoder = null;
    if (audioEncoder === currentAudioEncoder) audioEncoder = null;
  };

  const track = new MediaStreamTrack({ kind: "video" });
  activeTrack = track;
  const audioTrack = new MediaStreamTrack({ kind: "audio" });
  activeAudioTrack = audioTrack;
  const stream = new MediaStream([track, audioTrack]);
  pc.addTrack(track, stream);
  pc.addTrack(audioTrack, stream);
  const videoSender = pc.getSenders().find((sender) => sender.track === track);
  const audioSender = pc.getSenders().find((sender) => sender.track === audioTrack);

  pc.onIceCandidate.subscribe((candidate) => {
    if (!candidate) return;
    if (activePc !== pc || activeWs !== ws) return;
    const iceCandidate = candidate as unknown as {
      toJSON(): { candidate?: string; sdpMid?: string; sdpMLineIndex?: number; usernameFragment?: string };
    };
    const serialized = iceCandidate.toJSON();
    const info = serialized.candidate ?? "";
    const candidateType = info.match(/\btyp\s+(\w+)/)?.[1];
    // Docker's STUN-mapped port is not published by the container runtime,
    // so advertising it creates an unreachable candidate. The mapped host
    // candidate is the valid path for the local gateway/browser deployment.
    if (candidateType === "srflx" && !ADVERTISE_SERVER_REFLEXIVE_CANDIDATE) return;
    const candidateParts = info.split(" ");
    if (candidateType === "host") candidateParts[4] = ICE_ADVERTISE_HOST;
    const advertised = {
      ...serialized,
      candidate: candidateParts.join(" "),
    };
    log("local candidate:", (advertised.candidate ?? "").split(" ").slice(0, 9).join(" "));
    send(ws, { type: "candidate", candidate: advertised });
  });

  pc.onDataChannel.subscribe((dc) => setupDataChannel(dc));

  pc.connectionStateChange.subscribe((state) => {
    log("connectionState:", state);
    if (state === "connected" && activePc === pc) {
      inputDispatcher.start();
      if (!videoSender || !audioSender) {
        log("media sender setup incomplete");
        return;
      }
      if (!sessionEncoder) {
        sessionEncoder = new H264Source(track, videoSender.sendRtp.bind(videoSender));
        encoder = sessionEncoder;
        sessionEncoder.start();
      }
      if (!sessionAudioEncoder) {
        sessionAudioEncoder = new OpusSource(audioSender.sendRtp.bind(audioSender));
        audioEncoder = sessionAudioEncoder;
        sessionAudioEncoder.start().catch((error) => log("Opus start failed:", error));
      }
    } else if (state === "failed" || state === "closed") {
      stopSessionMedia();
    }
  });

  videoSender?.onPictureLossIndication.subscribe(() => {
    sessionEncoder?.requestKeyframe();
  });

  await pc.setRemoteDescription({ type: "offer", sdp });
  if (activePc !== pc || activeWs !== ws) {
    pc.close();
    return;
  }
  remoteDescriptionReady = true;
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  if (activePc !== pc || activeWs !== ws) {
    pc.close();
    return;
  }
  send(ws, { type: "answer", sdp: answer.sdp });
  log("answer sent");

  while (pendingCandidates.length > 0) {
    const candidate = pendingCandidates.shift();
    if (candidate) await pc.addIceCandidate(candidate as never).catch(() => undefined);
  }
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(desktopReady ? 200 : 503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: desktopReady ? "ok" : "starting" }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  log("client connected");

  ws.on("message", (data) => {
    let message: unknown;
    try {
      message = JSON.parse(data.toString());
    } catch {
      return;
    }
    if (!message || typeof message !== "object") return;
    const msg = message as { type?: string; sdp?: string };
    switch (msg.type) {
      case "offer":
        if (msg.sdp) {
          handleOffer(ws, msg.sdp).catch((error) => log("offer handling failed", error));
        }
        break;
      case "candidate": {
        const candidate = (message as { candidate?: RemoteCandidateMessage }).candidate;
        if (candidate) {
          handleRemoteCandidate(candidate).catch(() => undefined);
        }
        break;
      }
      case "ping": {
        const t = (message as { t?: number }).t;
        send(ws, { type: "pong", t });
        break;
      }
      case "input":
        dispatchInput(message);
        break;
      default:
        break;
    }
  });

  ws.on("close", () => {
    log("client disconnected");
    // A stale signaling socket must not tear down a newer WebRTC session.
    if (activeWs === ws) closeSession();
  });

  ws.on("error", () => undefined);
});

server.listen(8080, () => {
  log(`agent listening on :8080`);
});

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  if (!existsSync("/tmp/.X11-unix/X99")) {
    log("starting Xvfb");
    startDisplay();
    await waitForXServer();
  }
  await startPulseAudio();
  await startDesktopApp();
  desktopReady = true;
  log("desktop ready");
}

main().catch((error) => log("startup error", error));
