import { env } from '@/services/env';
import { connectFirebase, firebaseRepository } from '@/services/repository/firebase';
import { connectSqlite, sqliteRepository } from '@/services/repository/sqlite';

export const repository = (() => {
  if (env('DATABASE') === 'sqlite') return sqliteRepository;
  if (env('DATABASE') === 'firebase') return firebaseRepository;
  throw new Error('No repository selected');
})();

export const connect = async () => {
  if (env('DATABASE') === 'sqlite') return await connectSqlite();
  if (env('DATABASE') === 'firebase') return await connectFirebase();
  throw new Error('No repository selected');
};
