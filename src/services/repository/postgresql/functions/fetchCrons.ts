import { buildCronsFromSQLite } from '@/services/cron';
import { database } from '@/services/repository/postgresql';
import { Repository, SQLiteCron } from '@/types';

export const fetchCrons: Repository['fetchCrons'] = async () => {
  const result = await database().query<SQLiteCron>(`
    SELECT * FROM cron
  `);

  const crons = result.rows;

  return buildCronsFromSQLite(crons);
};
