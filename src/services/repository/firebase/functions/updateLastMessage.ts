import { database } from '@/services/repository/firebase';
import { Repository } from '@/types';

export const updateLastMessage: Repository['updateLastMessage'] = async (cronId, lastMessage) => {
  await database().collection('crons').doc(cronId).update({ current: lastMessage });
};
