import pg from 'pg';
import { migrate } from 'postgres-migrations';

import { env } from '@/services/env';
import { createLogger } from '@/services/logger';

const logger = createLogger();

export async function migratePostgresql() {
  let migrationClient: pg.Client | undefined = undefined;
  try {
    migrationClient = new pg.Client({
      host: env('PG_HOST'),
      user: env('PG_MIGRATION_USER'),
      password: env('DB_PASS_IFOOD_DAILY_PICK_MIGRATION'),
      database: env('PG_DATABASE'),
      port: env('PG_MIGRATION_PORT'),
    });
    await migrationClient.connect();
    await migrationClient.query(`set role "${env('PG_DATABASE')}"`);
    await migrate({ client: migrationClient }, 'src/services/repository/postgresql/migrations');
  } catch (e) {
    logger.error({ message: 'Error migrating database' });
    logger.error(e);
  } finally {
    await migrationClient?.end();
  }
}
