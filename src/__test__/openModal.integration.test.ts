import { Server } from 'http';

import request from 'supertest';

import { pick } from '@/fixtures/pick';

let server: Server;

describe('openModal', () => {
  beforeAll(async () => {
    const { startServer } = require('@/bootstrap/start');
    ({ server } = await startServer());
  });

  afterAll(() => {
    server?.close((err) => {
      if (err) console.error(err);
    });
  });

  it('should open modal', async () => {
    const response = await request(server).post('/api/commands/daily/pick').send(pick);
    expect(response.body).toBe(200);
  });
});
