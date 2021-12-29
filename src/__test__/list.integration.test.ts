import { request } from './server';

import { list } from '@/__test__/fixtures/list';
import { NO_CRONS_FOUND } from '@/i18n';
import * as functions from '@/services/database/functions/fetchCronsByChannelAndTeam';

jest.mock('@/bootstrap/schedule');

describe('listCrons', () => {
  it('should display an empty list', async () => {
    jest.spyOn(functions, 'fetchCronsByChannelAndTeam').mockResolvedValue([]);

    const req = request().post('/api/commands/daily/pick');
    const res = await req.send(list.body);

    const body = JSON.stringify(res.body, null, 2);
    expect(body).toContain(NO_CRONS_FOUND);
    expect(res.statusCode).toBe(200);
  });

  it('should display a list', async () => {
    jest.spyOn(functions, 'fetchCronsByChannelAndTeam').mockResolvedValue([
      {
        id: '1',
        name: 'cron 1',
        intervals: ['* * * * *'],
        channel: 'C1',
        team: 'T1',
        current: 'U1',
        users: [],
        createdAt: 'createdAt #1',
      },
      {
        id: '2',
        name: 'cron 2',
        intervals: ['* * * * *'],
        channel: 'C1',
        team: 'T1',
        current: 'U2',
        users: [],
        createdAt: 'createdAt #2',
      },
    ]);

    const req = request().post('/api/commands/daily/pick');
    const res = await req.send(list.body);
    const body = JSON.stringify(res.body, null, 2);

    expect(body).not.toContain(NO_CRONS_FOUND);
    expect(body).toContain('*createdAt #1*');
    expect(body).toContain('*createdAt #2*');
    expect(res.statusCode).toBe(200);
  });
});
