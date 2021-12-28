export type Cron = {
  channel: string;
  team: string;
  users: string[];
  intervals: string[];
};

export type PersistedCron = Cron & {
  id: string;
  current: string;
  createdAt?: string;
};
