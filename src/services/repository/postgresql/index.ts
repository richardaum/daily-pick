import pg from 'pg';
import { migrate } from 'postgres-migrations';

import { env } from '@/services/env';
import { createLogger, DEBUG, getLogLevel } from '@/services/logger';

let instance: pg.Client;

const logger = createLogger();

export const database = () => {
  if (!instance) throw new Error('PostgresSQL is being accessed before instantiated');
  return instance;
};

export const connectPostgresql = async () => {
  const client = new pg.Client({
    host: env('PG_HOST'),
    user: env('PG_APP_USER'),
    password: env('DB_PASS_IFOOD_DAILY_PICK_APP'),
    database: env('PG_DATABASE'),
    port: env('PG_APP_PORT'),
  });

  await client.connect();

  try {
    await migrate(
      {
        client: new pg.Client({
          host: env('PG_HOST'),
          user: env('PG_MIGRATION_USER'),
          password: env('DB_PASS_IFOOD_DAILY_PICK_MIGRATION'),
          database: env('PG_DATABASE'),
          port: env('PG_MIGRATION_PORT'),
        }),
      },
      'src/services/repository/postgresql/migrations'
    );
  } finally {
    await client.end();
  }

  if (getLogLevel() >= DEBUG) {
    const query = client.query;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    client.query = (...args) => {
      logger.debug('query:', args);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return query.apply(client, args);
    };
  }

  instance = client;
};

export { postgresqlRepository } from './functions';
