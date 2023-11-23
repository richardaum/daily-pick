import { buildCronFromSQLite } from '@/services/cron';
import { database } from '@/services/repository/postgresql';
import { Repository } from '@/types';
import { SQLiteCron } from '@/types';

export const destroyCron: Repository['destroyCron'] = async (cronId: string) => {
  const result = await database().query<SQLiteCron>(
    `
      SELECT * FROM cron
      WHERE id = $1
    `,
    [cronId]
  );

  const cron = result.rows[0];

  if (!cron) return;

  await database().query(
    `
      DELETE FROM cron
      WHERE id = $1
    `,
    [cronId]
  );

  return buildCronFromSQLite(cron);
};
