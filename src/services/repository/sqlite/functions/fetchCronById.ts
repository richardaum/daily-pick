import { database } from '@/services/repository/sqlite';
import { Repository, SQLiteCron } from '@/types';

export const fetchCronById: Repository['fetchCronById'] = async (cronId: string) => {
  const cron = await database().get<SQLiteCron>(
    ` 
      SELECT * FROM cron
      WHERE id = :id
    `,
    { ':id': cronId }
  );

  return cron ? { ...cron, type: 'sqlite' } : cron;
};
