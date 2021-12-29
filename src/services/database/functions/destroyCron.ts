import { database } from '..';

import { buildCreatedAt } from './buildCreatedAt';

import { Cron, PersistedCron } from '@/types';

export const destroyCron = async (cronId: string) => {
  const cronSnapshot = await database.collection('crons').doc(cronId).get();
  const cronData = cronSnapshot.data() as Cron;
  const cron = {
    ...cronData,
    createdAt: buildCreatedAt(cronSnapshot.createTime?.toDate()),
    id: cronSnapshot.id,
  } as PersistedCron;

  await database.collection('crons').doc(cronId).delete();

  return cron;
};
