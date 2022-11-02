import { Queue } from '@/models/queue';
import { database } from '@/services/repository/firebase';
import { Cron, Repository } from '@/types';

export const getUsers: Repository['getUsers'] = async (cronId) => {
  let currentUserId;

  const cronRef = database().collection('crons').doc(cronId);
  const cronSnapshot = await cronRef.get();
  const cron = cronSnapshot.data() as Cron;

  const order = new Queue(cron.users);
  currentUserId = cron.current;

  if (!currentUserId) {
    currentUserId = order.getByIndex(0).get();
  }

  const nextUserId = order.getByValue(currentUserId).next().get();

  return {
    current: currentUserId,
    next: nextUserId,
  };
};
