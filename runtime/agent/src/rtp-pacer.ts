import { RtpPacket } from "werift/nonstandard";

const RTP_HEADER_BYTES = 12;
const MAX_QUEUE_BYTES = 128 * 1024;
const MAX_FRAME_BYTES = 1024 * 1024;
const MAX_QUEUE_FRAMES = 3;
const DEFAULT_BITRATE = 50_000_000;

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

/** Serializes RTP output and prevents a slow network from accumulating latency. */
export class RtpPacer {
  private readonly queue: RtpPacket[][] = [];
  private queueBytes = 0;
  private draining = false;
  private nextSendAt = 0;

  constructor(
    private readonly sendRtp: (packet: RtpPacket) => Promise<void>,
    private readonly onOverflow: () => void,
    private readonly bitrate = Number(process.env.VIDEO_PACING_BPS || DEFAULT_BITRATE),
    private readonly onSendError: () => void = () => undefined,
  ) {}

  enqueue(packet: RtpPacket): void {
    this.enqueueFrame([packet]);
  }

  enqueueFrame(packets: RtpPacket[]): void {
    const frameBytes = packets.reduce(
      (bytes, packet) => bytes + packet.payload.length + RTP_HEADER_BYTES,
      0,
    );
    // Never drop individual packets from a frame. Losing part of an H264 frame
    // leaves the decoder waiting for a keyframe, which looks like a frozen or
    // flickering video. Keep only a small number of complete frames so latency
    // stays bounded; congestion triggers an encoder restart.
    if (
      frameBytes > MAX_FRAME_BYTES ||
      (this.queue.length > 0 &&
        (this.queue.length >= MAX_QUEUE_FRAMES ||
          this.queueBytes + frameBytes > MAX_QUEUE_BYTES))
    ) {
      this.clear();
      this.onOverflow();
      return;
    }

    this.queue.push(packets);
    this.queueBytes += frameBytes;
    if (!this.draining) void this.drain();
  }

  clear(): void {
    this.queue.length = 0;
    this.queueBytes = 0;
    this.nextSendAt = 0;
  }

  private async drain(): Promise<void> {
    this.draining = true;
    try {
      while (this.queue.length > 0) {
        const delay = this.nextSendAt - performance.now();
        if (delay > 0) await wait(delay);

        const frame = this.queue[0];
        if (!frame || frame.length === 0) {
          this.queue.shift();
          continue;
        }
        const packet = frame.shift();
        if (!packet) continue;
        this.queueBytes -= packet.payload.length + RTP_HEADER_BYTES;
        if (frame.length === 0) this.queue.shift();
        await this.sendRtp(packet);

        const packetDuration =
          ((packet.payload.length + RTP_HEADER_BYTES) * 8 * 1000) / this.bitrate;
        this.nextSendAt = Math.max(performance.now(), this.nextSendAt) + packetDuration;
      }
    } catch {
      // A peer can close while a packet is in flight. Do not leave an
      // unhandled rejection or continue queueing packets for that peer.
      this.clear();
      this.onSendError();
    } finally {
      this.draining = false;
      if (this.queue.length > 0) void this.drain();
    }
  }
}
