import { database } from '@/services/repository/sqlite';
import { Repository } from '@/types';

export const updateLastMessage: Repository['updateLastMessage'] = async (cronId, lastMessage) => {
  await database().run(
    `
      UPDATE cron 
      SET lastMessage = :lastMessage
      WHERE id = :id
    `,
    {
      ':id': cronId,
      ':lastMessage': lastMessage,
    }
  );
};
