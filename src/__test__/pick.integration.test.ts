import { mocked } from 'jest-mock';

import { request } from './server';

import { pick } from '@/fixtures/pick';
import { slack } from '@/services/slack';

jest.mock('@/bootstrap/schedule');

describe('pick', () => {
  it('should open modal', async () => {
    const req = request().post('/api/commands/daily/pick');
    const res = await req.send(pick.body);

    const open = mocked(slack, true).client.views.open;
    expect(open).toHaveBeenCalledTimes(1);

    const parameter = open.mock.calls[0][0];
    expect(res.statusCode).toBe(200);
    expect(parameter?.view.callback_id).toBe('openModal');
    expect(parameter?.trigger_id).toBe(pick.body.trigger_id);
    expect(parameter?.view.private_metadata).toBe(pick.body.channel_id);
  });
});