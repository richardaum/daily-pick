import { buildCronFromSQLite } from '@/services/cron';
import { database } from '@/services/repository/postgresql';
import { Repository, SQLiteCron } from '@/types';

export const getUsers: Repository['getUsers'] = async (cronId: string) => {
  const result = await database().query<SQLiteCron>(
    `
    SELECT * FROM cron
    WHERE id = $1
  `,
    [cronId]
  );

  const rawCron = result.rows[0];

  if (!rawCron) throw new Error(`The cron ${cronId} does not exist`);

  const cron = buildCronFromSQLite(rawCron);
  return cron.users;
};
