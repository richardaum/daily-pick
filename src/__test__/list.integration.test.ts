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
});
