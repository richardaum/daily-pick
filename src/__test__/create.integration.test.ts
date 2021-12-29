import { SlackViewAction } from '@slack/bolt';
import { mocked } from 'jest-mock';

import { request } from './server';

import { create } from '@/__test__/fixtures/create';
import * as cron from '@/services/cron';
import * as functions from '@/services/database/functions/persistCron';

jest.mock('@/bootstrap/schedule');

describe('createCron', () => {
  it('should persist and schedule cron', async () => {
    const payload = JSON.parse(create.body.payload) as SlackViewAction;

    jest.spyOn(cron, 'scheduleMultiple');
    jest.spyOn(functions, 'persistCron').mockResolvedValue({
      channel: payload.view.private_metadata,
      team: payload.view.team_id,
      users: payload.view.state.values.participants.participants_select.selected_users ?? [],
      intervals: [],
      current: payload.user.id,
      id: 'id',
    });

    const req = request().post('/api/commands/daily/act');
    const res = await req.send(create.body);

    const persistCron = mocked(functions.persistCron, true);
    expect(persistCron).toHaveBeenCalledTimes(1);

    const parameter = persistCron.mock.calls[0][0];
    expect(parameter.channel).toBe(payload.view.private_metadata);
    expect(parameter.team).toBe(payload.view.team_id);
    expect(parameter.users).toEqual(payload.view.state.values.participants.participants_select.selected_users);
    expect(parameter.intervals).toBeTruthy();

    const scheduleMultiple = mocked(cron.scheduleMultiple, true);
    expect(scheduleMultiple).toHaveBeenCalledTimes(1);

    expect(res.statusCode).toBe(200);
  });
});
