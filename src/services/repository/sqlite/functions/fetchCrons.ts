import { buildCronsFromSQLite } from '@/services/cron';
import { database } from '@/services/repository/sqlite';
import { Repository, SQLiteCron } from '@/types';

export const fetchCrons: Repository['fetchCrons'] = async () => {
  const crons = await database().all<SQLiteCron[]>(`
    SELECT * FROM cron
  `);

  return buildCronsFromSQLite(crons);
};
