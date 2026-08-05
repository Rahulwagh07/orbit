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
    console.log("Connected to runtime agent");
  });

  agentWs.on("message", (data, isBinary) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data, { binary: isBinary });
    }
  });

  agentWs.on("close", () => {
    console.log("Agent connection closed");
    if (ws.readyState === WebSocket.OPEN) {
      ws.close(1011, "Agent disconnected");
    }
  });

  agentWs.on("error", (e) => {
    console.error("Agent WS error", e);
  });

  ws.on("message", (data, isBinary) => {
    if (agentWs.readyState === WebSocket.OPEN) {
      agentWs.send(data, { binary: isBinary });
    }
  });

  ws.on("close", () => {
    console.log("Browser disconnected");
    agentWs.close();
  });
});

server.listen(4001, () => {
  console.log("Gateway listening on ws://localhost:4001");
});
