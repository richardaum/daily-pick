import { buildCreatedAt } from '@/services/repository/common';
import { database } from '@/services/repository/firebase';
import { Repository } from '@/types';
import { Cron, FirebaseCron } from '@/types';

export const destroyCron: Repository['destroyCron'] = async (cronId: string) => {
  const cronSnapshot = await database().collection('crons').doc(cronId).get();
  const cronData = cronSnapshot.data() as FirebaseCron;
  const cron = {
    ...cronData,
    createdAt: buildCreatedAt(cronSnapshot.createTime?.toDate()),
    id: cronSnapshot.id,
  } as Cron;

  await database().collection('crons').doc(cronId).delete();

  return cron;
};
