export type Cron = {
  name?: string;
  channel: string;
  team: string;
  users: string[];
  intervals: string[];
};

export type PersistedCron = Cron & {
  id: string;
  name: string;
  current: string;
  createdAt?: string;
};
