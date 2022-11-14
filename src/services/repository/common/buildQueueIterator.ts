import { Queue } from '@/models/queue';

export const buildQueueIterator = (users: string[], current?: string) => {
  let currentUserId = current;
  const order = new Queue(users);

  if (!currentUserId) {
    currentUserId = order.getByIndex(0).get();
  }

  const it = order.getByValue(currentUserId);
  return it;
};
