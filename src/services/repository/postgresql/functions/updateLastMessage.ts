import { database } from '@/services/repository/postgresql';
import { Repository } from '@/types';

export const updateLastMessage: Repository['updateLastMessage'] = async (cronId, lastMessage) => {
  await database().query(
    `
      UPDATE cron
      SET "lastMessage" = $1
      WHERE id = $2
    `,
    [lastMessage, cronId]
  );
};
