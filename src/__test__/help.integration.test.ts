import { request } from './server';

import { help } from '@/__test__/fixtures/help';
import { AVAILABLE_COMMANDS } from '@/i18n';

jest.mock('@/bootstrap/schedule');

describe('pick', () => {
  it('should send help instructions', async () => {
    const req = request().post('/api/commands/daily/pick');
    const res = await req.send(help.body);

    const body = JSON.stringify(res.body, null, 2);
    expect(body).toContain(AVAILABLE_COMMANDS);
    expect(res.statusCode).toBe(200);
  });
});
