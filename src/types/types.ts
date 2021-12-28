export type Cron = {
  id: string;
  channel: string;
  team: string;
  users: string[];
  intervals: string[];
  current?: string;
};
