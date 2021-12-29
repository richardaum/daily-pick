import { request } from './server';

import { help } from '@/__test__/fixtures/help';

jest.mock('@/bootstrap/schedule');

describe('pick', () => {
  it('should open modal', async () => {
    const req = request().post('/api/commands/daily/pick');
    const res = await req.send(help.body);

    const body = JSON.stringify(res.body, null, 2);
    expect(body).toContain('Comandos disponíveis:');
    expect(res.statusCode).toBe(200);
  });
});
