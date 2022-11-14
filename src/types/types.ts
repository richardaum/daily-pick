export type FirebaseCron = Omit<Cron, 'createdAt'>;

export type SQLiteCron = Omit<Cron, 'users' | 'intervals' | 'createdAt'> & {
  users: string;
  intervals: string;
  createTime: string;
};

export type Cron = {
  /** uuid */
  id: string;
  /** iso */
  createdAt: string;

  /** current user */
  current: string;
  /** cron name */
  name: string;
  /** slack team */
  team: string;
  /** participants users */
  users: string[];
  /** cron intervals */
  intervals: string[];

  channel: string;
  responseUrl?: string;
};

export interface Repository {
  fetchCrons(): Promise<Cron[]>;
  fetchCronsByChannelAndTeam(channelId: string, teamId: string): Promise<Crons>;
  destroyCron(cronId: string): Promise<Cron>;
  getUsers(cronId: string): Promise<{ current: string; next: string }>;
  persistCron(cron: FirebasePersistingCron): Promise<Omit<Cron, 'createdAt'>>;
  updateCurrentUser(cronId: string, user: string): Promise<void>;
}

export type Crons = (FirebaseCron & {
  id: string;
  name: string;
  current: string;
  createdAt?: string | undefined;
})[];

export type FirebasePersistingCron = Omit<FirebaseCron, 'id' | 'current'>;
