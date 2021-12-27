import { database } from '@/database';
import { Queue } from '@/queue';
import { Cron, User } from '@/types';

export const getCurrentUser = async (team: string, channel: string) => {
  let currentUserSnapshot, currentUser, currentUserId;

  const channelRef = database
    .collection('teams')
    .doc(team)
    .collection('channels')
    .doc(channel);

  const usersRef = channelRef.collection('users');

  const cronSnapshot = await channelRef.get();
  const cron = cronSnapshot.data() as Cron;
  const order = new Queue(cron.order);

  currentUserSnapshot = await usersRef.doc('current').get();
  currentUser = currentUserSnapshot.data() as User;
  currentUserId = currentUser.id;

  if (!currentUser) {
    currentUserId = order.getByIndex(0).get();
    currentUserSnapshot = await usersRef.doc(currentUserId).get();
    currentUser = currentUserSnapshot.data() as Omit<User, 'id'>;
  }

  const nextUserId = order.getByValue(currentUserId).next();
  const nextUserSnapshot = await usersRef.doc(nextUserId.get()).get();
  const nextUser = nextUserSnapshot.data() as Omit<User, 'id'>;

  return {
    current: { id: currentUserId, ...currentUser },
    next: { id: nextUserSnapshot.id, ...nextUser },
  };
};
