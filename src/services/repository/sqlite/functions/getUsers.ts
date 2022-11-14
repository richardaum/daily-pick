import { buildCronFromSQLite } from '@/services/cron';
import { database } from '@/services/repository/sqlite';
import { Repository, SQLiteCron } from '@/types';

export const getUsers: Repository['getUsers'] = async (cronId: string) => {
  const rawCron = await database().get<SQLiteCron>(
    `
    SELECT * FROM cron
    WHERE id = :id
  `,
    { ':id': cronId }
  );

  if (!rawCron) throw new Error(`The cron ${cronId} does not exist`);

  const cron = buildCronFromSQLite(rawCron);
  return cron.users;
};
