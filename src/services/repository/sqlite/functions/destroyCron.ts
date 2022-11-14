import { buildCronFromSQLite } from '@/services/cron';
import { database } from '@/services/repository/sqlite';
import { Repository } from '@/types';
import { SQLiteCron } from '@/types';

export const destroyCron: Repository['destroyCron'] = async (cronId: string) => {
  const cron = await database().get<SQLiteCron>(
    `
      SELECT * FROM cron
      WHERE id = :id
    `,
    { ':id': cronId }
  );

  if (!cron) return;

  await database().run(
    `
      DELETE FROM cron 
      WHERE id = :id
    `,
    { ':id': cronId }
  );

  return buildCronFromSQLite(cron);
};
