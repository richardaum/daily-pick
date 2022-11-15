import { SlackViewAction } from '@slack/bolt';
import { mocked } from 'jest-mock';

import { request } from './server';

import { create } from '@/__test__/fixtures/create';
import { WAS_CREATED, YOUR_CRON } from '@/i18n';
import * as cron from '@/services/cron';
import { repository } from '@/services/repository';
import { app } from '@/services/slack';

jest.mock('@/bootstrap/schedule');

describe('createCron', () => {
  it('should persist and schedule cron', async () => {
    const payload = JSON.parse(create.body.payload) as SlackViewAction;

    const cronPayload = {
      channel: payload.view.private_metadata,
      team: payload.view.team_id,
      users: payload.view.state.values.participants.participants_select.selected_users ?? [],
      intervals: [],
      current: payload.user.id,
      name: payload.view.state.values.name.name_input.value ?? 'Unknown name',
      id: 'id',
    };

    jest.spyOn(cron, 'scheduleMultiple');
    jest.spyOn(repository, 'persistCron').mockResolvedValue(cronPayload);

    const req = request().post('/api/commands/daily/act');
    const res = await req.send(create.body);

    const persistCron = mocked(repository.persistCron, true);
    expect(persistCron).toHaveBeenCalledTimes(1);

    const parameter = persistCron.mock.calls[0][0];
    expect(parameter.channel).toBe(cronPayload.channel);
    expect(parameter.team).toBe(cronPayload.team);
    expect(parameter.users).toEqual(cronPayload.users);
    expect(parameter.intervals).toBeTruthy();

    const scheduleMultiple = mocked(cron.scheduleMultiple, true);
    expect(scheduleMultiple).toHaveBeenCalledTimes(1);

    const postEphemeral = mocked(app.client.chat.postEphemeral, true);
    expect(postEphemeral).toHaveBeenCalledWith({
      channel: payload.view.private_metadata,
      user: payload.user.id,
      text: `${YOUR_CRON} "${cronPayload.name}" ${WAS_CREATED}`,
    });

    expect(res.statusCode).toBe(200);
  });
});
