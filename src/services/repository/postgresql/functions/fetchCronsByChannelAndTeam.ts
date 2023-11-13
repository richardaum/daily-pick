import { buildCronsFromSQLite } from '@/services/cron';
import { database } from '@/services/repository/sqlite';
import { Repository, SQLiteCron } from '@/types';

export const fetchCronsByChannelAndTeam: Repository['fetchCronsByChannelAndTeam'] = async (channel, team) => {
  const crons = await database().all<SQLiteCron[]>(
    ` 
      SELECT * FROM cron
      WHERE channel = :channel AND team = :team
    `,
    { ':channel': channel, ':team': team }
  );

  return buildCronsFromSQLite(crons);
};
