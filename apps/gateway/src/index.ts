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

  const agentWs = new WebSocket(`ws://127.0.0.1:${portNum}`);

  agentWs.on("open", () => {
    console.log(`[WebRTC Signaling] Connected to runtime agent for port ${portNum}`);
    // Send signaling initialized notification
    ws.send(JSON.stringify({ type: "signaling_ready", port: portNum }));
  });

  agentWs.on("message", (data, isBinary) => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        if (!isBinary) {
          const msg = JSON.parse(data.toString());
          if (msg.type === "offer" || msg.type === "answer" || msg.type === "candidate") {
            console.log(`[WebRTC Signaling] Agent -> Browser: ${msg.type}`);
          }
        }
      } catch (e) {
        // Ignored if non-JSON binary payload
      }
      ws.send(data, { binary: isBinary });
    }
  });

  agentWs.on("close", () => {
    console.log(`[WebRTC Signaling] Agent connection closed for port ${portNum}`);
    if (ws.readyState === WebSocket.OPEN) {
      ws.close(1011, "Agent disconnected");
    }
  });

  agentWs.on("error", (e) => {
    console.error(`[WebRTC Signaling] Agent WS error for port ${portNum}:`, e);
  });

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
    if (agentWs.readyState === WebSocket.OPEN) {
      agentWs.send(data, { binary: isBinary });
    }
  });

  ws.on("close", () => {
    console.log(`[WebRTC Signaling] Browser disconnected for port ${portNum}`);
    agentWs.close();
  });
});

server.listen(4001, () => {
  console.log("Gateway WebRTC Signaling Server listening on ws://localhost:4001");
});
