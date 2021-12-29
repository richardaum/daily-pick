import { database } from '..';

export const updateCurrentUser = async (cronId: string, user: string) => {
  await database.collection('crons').doc(cronId).update({ current: user });
};
