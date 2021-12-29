import { database } from '..';

import { Queue } from '@/models/queue';
import { PersistedCron } from '@/types';

export const getUsers = async (cronId: string) => {
  let currentUserId;

  const cronRef = database.collection('crons').doc(cronId);
  const cronSnapshot = await cronRef.get();
  const cron = cronSnapshot.data() as PersistedCron;

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
