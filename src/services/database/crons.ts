import { database } from './index';

import { Queue } from '@/models/queue';
import { Cron } from '@/types';

export const fetchCrons = async () => {
  const cronsRef = await database.collection('crons').listDocuments();
  const crons = await Promise.all(
    cronsRef.map(async (docRef) => {
      const cronSnapshot = await docRef.get();
      const cron = cronSnapshot.data() as Omit<Cron, 'id'>;
      return {
        ...cron,
        createdAt: cronSnapshot.createTime?.toDate().toISOString(),
        id: cronSnapshot.id,
      };
    })
  );
  return crons;
};

export const fetchCronsByChannelAndTeam = async (channel: string, team: string) => {
  const cronsRef = await database.collection('crons').where('channel', '==', channel).where('team', '==', team).get();
  const crons = cronsRef.docs.map((d) => d.data());
  console.log(crons);
  return [];
};

export const createCron = async (cron: Omit<Cron, 'id'>): Promise<Cron> => {
  const { users, team, channel, intervals } = cron;
  const crons = database.collection('crons');
  const cronRef = crons.doc();
  await cronRef.set({ team, channel, users, intervals });
  return { ...cron, id: cronRef.id };
};

export const updateCurrentUser = async (cronId: string, user: string) => {
  await database.collection('crons').doc(cronId).update({ current: user });
};

export const getUsers = async (cronId: string) => {
  let currentUserId;

  const cronRef = database.collection('crons').doc(cronId);
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
