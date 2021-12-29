import { Server } from 'http';

import Request from 'supertest';

let server: Server;

beforeAll(async () => {
  const { startServer } = await import('@/bootstrap/start');
  ({ server } = await startServer());
});

afterAll(() => {
  server?.close((err) => {
    if (err) throw err;
  });
});

export const request = () => Request(server);
