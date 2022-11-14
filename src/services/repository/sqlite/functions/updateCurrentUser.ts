import { database } from '@/services/repository/sqlite';
import { Repository } from '@/types';

export const updateCurrentUser: Repository['updateCurrentUser'] = async (cronId: string, user: string) => {
  await database().exec(
    `
      UPDATE cron 
      SET
        current = :current
      WHERE id = :id
    `,
    {
      ':id': cronId,
      ':current': user,
    }
  );
};
