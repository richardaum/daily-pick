import { env } from '@/services/env';
import { connectFirebase, firebaseRepository } from '@/services/repository/firebase';
import { connectPostgresql, postgresqlRepository } from '@/services/repository/postgresql';

export const repository = (() => {
  if (env('DATABASE') === 'firebase') return firebaseRepository;
  if (env('DATABASE') === 'postgresql') return postgresqlRepository;
  throw new Error('No repository selected');
})();

export const connect = async () => {
  if (env('DATABASE') === 'firebase') return await connectFirebase();
  if (env('DATABASE') === 'postgresql') return await connectPostgresql();
  throw new Error('No repository selected');
};
