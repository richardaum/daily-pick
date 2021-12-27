import { Timestamp } from '@/services/database';

export type Cron = {
  channel: string;
  createdAt: Timestamp;
  interval: string;
  team: string;
  order: string[];
};

export type User = {
  id: string;
  mention: string;
  name: string;
};
