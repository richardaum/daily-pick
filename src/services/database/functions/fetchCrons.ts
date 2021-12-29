import { database } from '..';

import { buildCreatedAt } from './buildCreatedAt';

import { Cron, PersistedCron } from '@/types';

export const fetchCrons = async () => {
  const cronsRef = await database.collection('crons').listDocuments();
  const crons = await Promise.all(
    cronsRef.map(async (docRef) => {
      const cronSnapshot = await docRef.get();
      const cron = cronSnapshot.data() as Cron;
      return {
        ...cron,
        createdAt: buildCreatedAt(cronSnapshot.createTime?.toDate()),
        id: cronSnapshot.id,
      } as PersistedCron;
    })
  );
  return crons;
};
