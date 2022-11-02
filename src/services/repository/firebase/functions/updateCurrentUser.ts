import { database } from '@/services/repository/firebase';
import { Repository } from '@/types';

export const updateCurrentUser: Repository['updateCurrentUser'] = async (cronId, user) => {
  await database().collection('crons').doc(cronId).update({ current: user });
};
