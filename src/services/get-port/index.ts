import net from 'net';

export function getPort({ port }: { port?: number } = {}) {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    let called = false;

    server.on('error', function (err) {
      server.close();
      if (!called) {
        called = true;
        reject(err);
      }
    });

    server.listen(port ?? 0, function () {
      const address = server.address() as { port: number };
      const port = address.port;
      server.close();
      if (!called) {
        called = true;
        if (!port) return reject(new Error("Unable to get the server's given port"));
        resolve(port);
      }
    });
  });
}
