import net from "net";

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
