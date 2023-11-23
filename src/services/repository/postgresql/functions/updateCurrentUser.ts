import { database } from '@/services/repository/postgresql';
import { Repository } from '@/types';

export const updateCurrentUser: Repository['updateCurrentUser'] = async (cronId: string, user: string) => {
  await database().query(
    `
      UPDATE cron
      SET current = $1
      WHERE id = $2
    `,
    [user, cronId]
  );
};
