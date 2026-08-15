import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { prisma } from "@repo/db";

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

wss.on("connection", async (ws, req) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const port = url.searchParams.get("port");

  if (!port) {
    ws.close(1008, "Missing port");
    return;
  }
  
  const portNum = parseInt(port, 10);
  if (isNaN(portNum)) {
    ws.close(1008, "Invalid port");
    return;
  }

  // Validate against DB to prevent SSRF
  const instance = await prisma.applicationInstance.findFirst({
    where: { port: portNum, status: "READY" }
  });

  if (!instance) {
    ws.close(1008, "Unauthorized port");
    return;
  }

  let agentWs: WebSocket | null = null;
  let browserClosed = false;
  const pendingBrowserMessages: { data: any; isBinary: boolean }[] = [];

  const openAgentSocket = (): Promise<WebSocket> => new Promise((resolve, reject) => {
    const candidate = new WebSocket(`ws://127.0.0.1:${portNum}`);
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
    try {
      if (!isBinary) {
        const msg = JSON.parse(data.toString());
        if (msg.type === "offer" || msg.type === "answer" || msg.type === "candidate") {
          console.log(`[WebRTC Signaling] Agent -> Browser: ${msg.type}`);
        }
      }
    } catch {
      // Ignore non-JSON signaling payloads.
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
    if (!isBinary) {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "offer" || msg.type === "answer" || msg.type === "candidate") {
          console.log(`[WebRTC Signaling] Browser -> Agent: ${msg.type}`);
        }
      } catch (e) {
        // Ignored
      }
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
