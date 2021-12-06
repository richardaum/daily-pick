import { Server } from 'http';
import request from 'supertest';
import { startServer } from './startServer';
import { command } from './main.fixtures';

let server: Server;

describe('slash command', () => {
  beforeAll(async () => {
    ({ server } = await startServer());
  });

  afterAll(() => {
    server.close((err) => {
      if (err) console.error(err);
    });
  });

  it('does something', async () => {
    const response = await request(server).post('/api/commands/daily/pick').send(command);
    expect(response.body).toBe(200);
  });
});
