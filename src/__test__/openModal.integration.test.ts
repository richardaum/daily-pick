import { Server } from 'http';

import request from 'supertest';

import { pick } from '@/fixtures/pick';

let server: Server;

jest.mock('@/bootstrap/schedule');

describe('openModal', () => {
  beforeAll(async () => {
    const { startServer } = await import('@/bootstrap/start');
    ({ server } = await startServer());
  });

  afterAll(() => {
    server?.close((err) => {
      if (err) throw err;
    });
  });

  it('should open modal', async () => {
    const response = await request(server).post('/api/commands/daily/pick').send(pick);
    expect(response.statusCode).toBe(200);
  });
});
