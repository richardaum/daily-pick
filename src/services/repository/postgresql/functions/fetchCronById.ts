import { buildCronFromSQLite } from '@/services/cron';
import { database } from '@/services/repository/postgresql';
import { Repository, SQLiteCron } from '@/types';

export const fetchCronById: Repository['fetchCronById'] = async (cronId: string) => {
  const result = await database().query<SQLiteCron>(
    `
      SELECT * FROM cron
      WHERE id = $1
    `,
    [cronId]
  );

  const cron = result.rows[0];

  return cron ? buildCronFromSQLite(cron) : cron;
};
