import { buildCreatedAt } from '@/services/repository/common';
import { database } from '@/services/repository/firebase';
import { Cron, FirebaseCron, Repository } from '@/types';

export const fetchCrons: Repository['fetchCrons'] = async () => {
  const cronsRef = await database().collection('crons').listDocuments();
  const crons = await Promise.all(
    cronsRef.map(async (docRef) => {
      const cronSnapshot = await docRef.get();
      const cron = cronSnapshot.data() as FirebaseCron;
      return {
        ...cron,
        createdAt: buildCreatedAt(cronSnapshot.createTime?.toDate()),
        id: cronSnapshot.id,
      } as Cron;
    })
  );
  return crons;
};
