import net from "net";
import dgram from "dgram";

export async function getAvailablePort(startPort = 10000, endPort = 40000): Promise<number> {
  return new Promise((resolve, reject) => {
    const port = Math.floor(Math.random() * (endPort - startPort + 1) + startPort);
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(port);
      });
      server.close();
    });
    
    server.on('error', () => {
      // Port in use, try again
      getAvailablePort(startPort, endPort).then(resolve).catch(reject);
    });
  });
}

function isUdpPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = dgram.createSocket("udp4");
    socket.once("error", () => resolve(false));
    socket.bind(port, "0.0.0.0", () => {
      socket.close();
      resolve(true);
    });
  });
}

/** Allocates a contiguous UDP port range (published 1:1 for WebRTC media). */
export async function getAvailableUdpRange(
  count = 20,
  startPort = 10000,
  endPort = 40000,
): Promise<[number, number]> {
  for (let attempt = 0; attempt < 50; attempt++) {
    const min = Math.floor(Math.random() * (endPort - startPort - count + 1) + startPort);
    const max = min + count - 1;
    let allFree = true;
    for (let port = min; port <= max; port++) {
      if (!(await isUdpPortFree(port))) {
        allFree = false;
        break;
      }
    }
    if (allFree) return [min, max];
  }
  throw new Error("Could not allocate a free UDP port range");
}