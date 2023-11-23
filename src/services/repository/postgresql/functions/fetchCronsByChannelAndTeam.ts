import { buildCronsFromSQLite } from '@/services/cron';
import { database } from '@/services/repository/postgresql';
import { Repository, SQLiteCron } from '@/types';

export const fetchCronsByChannelAndTeam: Repository['fetchCronsByChannelAndTeam'] = async (channel, team) => {
  const result = await database().query<SQLiteCron>(
    `
      SELECT * FROM cron
      WHERE channel = $1 AND team = $2
    `,
    [channel, team]
  );

  const crons = result.rows;

  return buildCronsFromSQLite(crons);
};
