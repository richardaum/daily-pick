import { BlockAction, ButtonAction } from '@slack/bolt';
import axios from 'axios';
import { mocked } from 'jest-mock';

import { request } from './server';

import { remove } from '@/__test__/fixtures/remove';
import { repository } from '@/services/repository';
import { Cron } from '@/types';

jest.mock('@/bootstrap/schedule');

describe('pick', () => {
  it('should remove a cron', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({});
    jest.spyOn(repository, 'destroyCron').mockResolvedValue({ intervals: [] } as unknown as Cron);
    jest.spyOn(repository, 'fetchCronsByChannelAndTeam').mockResolvedValue([
      {
        id: '1',
        name: 'cron',
        intervals: ['* * * * *'],
        channel: 'C1',
        team: 'T1',
        current: 'U1',
        users: [],
        createdAt: 'createdAt #1',
      },
    ]);

    const payload = JSON.parse(remove.body.payload) as BlockAction;

    const req = request().post('/api/commands/daily/act');
    const res = await req.send(remove.body);

    const post = mocked(axios.post, true);
    expect(post).toHaveBeenCalled();

    const destroy = mocked(repository.destroyCron, true);
    const action = payload.actions[0] as ButtonAction;
    expect(destroy).toHaveBeenCalledWith(action.value);

    const parameters = post.mock.calls[0];
    expect(parameters[0]).toBe(payload.response_url);
    expect(parameters[1]).toBeTruthy();

    expect(res.statusCode).toBe(200);
  });
});
