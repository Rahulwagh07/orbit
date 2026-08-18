import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { prisma } from "@repo/db";
import { jwtVerify } from "jose";
import { env } from "@repo/env";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

function getCookie(cookieHeader: string, name: string): string | null {
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const parts = pair.split("=");
    const k = parts[0]?.trim();
    const v = parts.slice(1).join("=");
    if (k === name) {
      return v ? decodeURIComponent(v.trim()) : null;
    }
  }
  return null;
}

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("Gateway running");
    return;
  }
  res.writeHead(404);
  res.end("Not found");
});

const wss = new WebSocketServer({ server });

const isValidSignalingMessage = (data: any, isBinary: boolean): boolean => {
  if (isBinary) return false;
  try {
    const msg = JSON.parse(data.toString());
    if (!msg || typeof msg !== "object") return false;
    const type = msg.type;
    return (
      type === "offer" ||
      type === "answer" ||
      type === "candidate" ||
      type === "signaling_ready" ||
      type === "ping" ||
      type === "pong"
    );
  } catch {
    return false;
  }
};

wss.on("connection", async (ws, req) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const pathParts = url.pathname.split("/");
  const instanceId = pathParts[2];
  
  const port = url.searchParams.get("port");
  const token = url.searchParams.get("token");

  if (!instanceId || !port || !token) {
    console.warn("[Gateway Authentication] Missing connection parameters");
    ws.close(1008, "Missing connection parameters");
    return;
  }
  
  const portNum = parseInt(port, 10);
  if (isNaN(portNum)) {
    console.warn("[Gateway Authentication] Invalid port number");
    ws.close(1008, "Invalid port");
    return;
  }

  // 1. Authenticate user from JWT cookie
  const cookieHeader = req.headers.cookie || "";
  const jwtToken = getCookie(cookieHeader, "access_token");

  if (!jwtToken) {
    console.warn("[Gateway Authentication] Connection rejected: Missing access_token cookie");
    ws.close(1008, "Unauthorized: missing token");
    return;
  }

  let userId: string;
  try {
    const { payload } = await jwtVerify(jwtToken, secretKey);
    userId = (payload as any).userId;
  } catch (error) {
    console.warn("[Gateway Authentication] Connection rejected: Invalid JWT token:", error);
    ws.close(1008, "Unauthorized: invalid token");
    return;
  }

  // 2. Validate session & instance ownership in DB
  const instance = await prisma.applicationInstance.findUnique({
    where: { shortId: instanceId },
    include: {
      workspace: {
        select: { userId: true }
      }
    }
  });

  if (!instance) {
    console.warn(`[Gateway Authorization] Connection rejected: Instance ${instanceId} not found`);
    ws.close(1008, "Instance not found");
    return;
  }

  if (instance.status !== "READY") {
    console.warn(`[Gateway Authorization] Connection rejected: Instance ${instanceId} status is ${instance.status}`);
    ws.close(1008, "Instance not ready");
    return;
  }

  if (instance.port !== portNum) {
    console.warn(`[Gateway Authorization] Connection rejected: Port mismatch for instance ${instanceId}`);
    ws.close(1008, "Port mismatch");
    return;
  }

  if (instance.workspace.userId !== userId) {
    console.warn(`[Gateway Authorization] Connection rejected: User ${userId} does not own workspace of instance ${instanceId}`);
    ws.close(1008, "Unauthorized user");
    return;
  }

  // 3. Verify connection token matches token inside DB's deployedUrl
  let dbToken = "";
  if (instance.deployedUrl) {
    try {
      const dbUrl = new URL(instance.deployedUrl);
      dbToken = dbUrl.searchParams.get("token") || "";
    } catch {
      // Ignored
    }
  }

  if (!dbToken || dbToken !== token) {
    console.warn(`[Gateway Authorization] Connection rejected: Session token mismatch for instance ${instanceId}`);
    ws.close(1008, "Invalid session token");
    return;
  }

  let agentWs: WebSocket | null = null;
  let browserClosed = false;
  const pendingBrowserMessages: { data: any; isBinary: boolean }[] = [];

  const openAgentSocket = (): Promise<WebSocket> => new Promise((resolve, reject) => {
    const candidate = new WebSocket(`ws://127.0.0.1:${portNum}?token=${token}`);
    let settled = false;
    const timeout = setTimeout(() => {
      candidate.terminate();
      fail(new Error("runtime agent connection timeout"));
    }, 1500);
    const cleanup = () => {
      clearTimeout(timeout);
      candidate.removeListener("error", fail);
      candidate.removeListener("close", fail);
    };
    const succeed = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(candidate);
    };
    function fail(error: Error) {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    }
    candidate.once("open", succeed);
    candidate.once("error", fail);
    candidate.once("close", () => fail(new Error("runtime agent closed")));
  });

  const forwardAgentMessage = (data: any, isBinary: boolean) => {
    if (ws.readyState !== WebSocket.OPEN) return;
    if (!isValidSignalingMessage(data, isBinary)) {
      console.warn("[Gateway Security] Dropped non-signaling message from agent");
      return;
    }
    try {
      const msg = JSON.parse(data.toString());
      console.log(`[WebRTC Signaling] Agent -> Browser: ${msg.type}`);
    } catch {
      // Ignore
    }
    ws.send(data, { binary: isBinary });
  };

  const connectAgent = async () => {
    for (let attempt = 1; attempt <= 10 && !browserClosed; attempt++) {
      try {
        agentWs = await openAgentSocket();
        console.log(`[WebRTC Signaling] Connected to runtime agent for port ${portNum}`);
        agentWs.on("message", forwardAgentMessage);
        agentWs.on("close", () => {
          console.log(`[WebRTC Signaling] Agent connection closed for port ${portNum}`);
          if (ws.readyState === WebSocket.OPEN) ws.close(1011, "Agent disconnected");
        });
        agentWs.on("error", (error) => {
          console.error(`[WebRTC Signaling] Agent WS error for port ${portNum}:`, error);
        });
        ws.send(JSON.stringify({ type: "signaling_ready", port: portNum }));
        while (pendingBrowserMessages.length > 0) {
          const { data, isBinary } = pendingBrowserMessages.shift()!;
          agentWs.send(data, { binary: isBinary });
        }
        return;
      } catch (error) {
        console.warn(`[WebRTC Signaling] Agent unavailable for port ${portNum} (attempt ${attempt})`);
        if (attempt < 10) await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
    if (ws.readyState === WebSocket.OPEN) ws.close(1011, "Agent unavailable");
  };

  ws.on("message", (data, isBinary) => {
    if (!isValidSignalingMessage(data, isBinary)) {
      console.warn("[Gateway Security] Dropped non-signaling message from browser");
      return;
    }
    try {
      const msg = JSON.parse(data.toString());
      console.log(`[WebRTC Signaling] Browser -> Agent: ${msg.type}`);
    } catch (e) {
      // Ignored
    }
    if (agentWs?.readyState === WebSocket.OPEN) {
      agentWs.send(data, { binary: isBinary });
    } else if (pendingBrowserMessages.length < 50) {
      pendingBrowserMessages.push({ data, isBinary });
    }
  });

  ws.on("close", () => {
    browserClosed = true;
    console.log(`[WebRTC Signaling] Browser disconnected for port ${portNum}`);
    agentWs?.close();
  });

  void connectAgent();
});

server.listen(4001, () => {
  console.log("Gateway WebRTC Signaling Server listening on ws://localhost:4001");
});
