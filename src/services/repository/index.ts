import { env } from '@/services/env';
import { connectFirebase, firebaseRepository } from '@/services/repository/firebase';
import { connectPostgresql, postgresqlRepository } from '@/services/repository/postgresql';
import { connectSqlite, sqliteRepository } from '@/services/repository/sqlite';

export const repository = (() => {
  if (env('DATABASE') === 'sqlite') return sqliteRepository;
  if (env('DATABASE') === 'firebase') return firebaseRepository;
  if (env('DATABASE') === 'postgresql') return postgresqlRepository;
  throw new Error('No repository selected');
})();

export const connect = async () => {
  if (env('DATABASE') === 'sqlite') return await connectSqlite();
  if (env('DATABASE') === 'firebase') return await connectFirebase();
  if (env('DATABASE') === 'postgresql') return await connectPostgresql();
  throw new Error('No repository selected');
};
