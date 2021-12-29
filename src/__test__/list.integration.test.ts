import { request } from './server';

import { list } from '@/fixtures/list';
import * as functions from '@/services/database/functions/fetchCronsByChannelAndTeam';

jest.mock('@/bootstrap/schedule');

describe('listCrons', () => {
  it('should display an empty list', async () => {
    jest.spyOn(functions, 'fetchCronsByChannelAndTeam').mockResolvedValue([]);

    const req = request().post('/api/commands/daily/pick');
    const res = await req.send(list.body);

    expect(JSON.stringify(res.body, null, 2)).toContain('Nenhum agendamento encontrado');
    expect(res.statusCode).toBe(200);
  });

  it('should display a list', async () => {
    jest.spyOn(functions, 'fetchCronsByChannelAndTeam').mockResolvedValue([
      {
        id: '1',
        intervals: ['* * * * *'],
        channel: 'C1',
        team: 'T1',
        current: 'U1',
        users: [],
        createdAt: 'createdAt #1',
      },
      {
        id: '2',
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

    expect(body).not.toContain('Nenhum agendamento encontrado');
    expect(body).toContain('*createdAt #1*');
    expect(body).toContain('*createdAt #2*');
    expect(res.statusCode).toBe(200);
  });
});
