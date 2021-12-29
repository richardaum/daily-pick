import { database } from '..';

import { Cron, PersistedCron } from '@/types';

type PersistingCron = Omit<Cron, 'id'> & { name: string };

export const persistCron = async (cron: PersistingCron): Promise<PersistedCron> => {
  const { users, team, channel, intervals } = cron;
  const crons = database.collection('crons');
  const cronRef = crons.doc();
  await cronRef.set({ team, channel, users, intervals });
  return { ...cron, id: cronRef.id, current: users[0] };
};
