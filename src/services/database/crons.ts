import { database } from './index';

import { Queue } from '@/models/queue';
import { Cron, PersistedCron } from '@/types';

export const fetchCrons = async () => {
  const cronsRef = await database.collection('crons').listDocuments();
  const crons = await Promise.all(
    cronsRef.map(async (docRef) => {
      const cronSnapshot = await docRef.get();
      const cron = cronSnapshot.data() as Cron;
      return {
        ...cron,
        createdAt: cronSnapshot.createTime?.toDate().toISOString(),
        id: cronSnapshot.id,
      } as PersistedCron;
    })
  );
  return crons;
};

export const destroyCron = async (cronId: string) => {
  const cronSnapshot = await database.collection('crons').doc(cronId).get();
  const cronData = cronSnapshot.data() as Cron;
  const cron = {
    ...cronData,
    createdAt: cronSnapshot.createTime?.toDate().toISOString(),
    id: cronSnapshot.id,
  } as PersistedCron;

  await database.collection('crons').doc(cronId).delete();

  return cron;
};

export const fetchCronsByChannelAndTeam = async (channel: string, team: string) => {
  const cronsRef = await database.collection('crons').where('channel', '==', channel).where('team', '==', team).get();
  const crons = cronsRef.docs.map((cronSnapshot) => {
    const cron = cronSnapshot.data() as Cron;
    return {
      ...cron,
      createdAt: cronSnapshot.createTime?.toDate().toISOString(),
      id: cronSnapshot.id,
    } as PersistedCron;
  });
  return crons;
};

export const persistCron = async (cron: Omit<Cron, 'id'>): Promise<PersistedCron> => {
  const { users, team, channel, intervals } = cron;
  const crons = database.collection('crons');
  const cronRef = crons.doc();
  await cronRef.set({ team, channel, users, intervals });
  return { ...cron, id: cronRef.id, current: users[0] };
};

export const updateCurrentUser = async (cronId: string, user: string) => {
  await database.collection('crons').doc(cronId).update({ current: user });
};

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
