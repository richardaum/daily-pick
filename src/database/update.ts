import { database } from '@/database';
import { User } from '@/types';

export const updateCurrentUser = async (
  team: string,
  channel: string,
  user: User
) => {
  await database
    .collection('teams')
    .doc(team)
    .collection('channels')
    .doc(channel)
    .collection('users')
    .doc('current')
    .set(user);
};
