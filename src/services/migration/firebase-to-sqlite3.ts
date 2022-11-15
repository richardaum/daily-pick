import { omit } from 'lodash';
import { DateTime } from 'luxon';

import { env } from '@/services/env';
import { connectFirebase, firebaseRepository } from '@/services/repository/firebase';
import { connectSqlite, database } from '@/services/repository/sqlite';

export const migrateFirebaseToSqlite3 = async () => {
  if (env('FIREBASE_TO_SQLITE_MIGRATION_ENABLED') !== 'true') return;

  connectFirebase();
  await connectSqlite();

  const crons = await firebaseRepository.fetchCrons();

  for (const cron of crons) {
    const persistingCron = {
      ...omit(cron, 'createdAt'),
      intervals: JSON.stringify(cron.intervals),
      users: JSON.stringify(cron.users),
      createTime: cron.createdAt,
      author: null,
      message: null,
    };

    const sql = Object.entries(persistingCron).reduce(
      (sql, [key, value]) => {
        return {
          marks: [...sql.marks, '?'],
          columns: [...sql.columns, key],
          values: [...sql.values, value],
        };
      },
      { columns: [] as string[], marks: [] as string[], values: [] as (string | null)[] }
    );

    const migrationTimestamp = env('FIREBASE_TO_SQLITE_MIGRATION_TIMESTAMP');

    if (!migrationTimestamp || DateTime.fromISO(cron.createdAt) > DateTime.fromISO(migrationTimestamp)) {
      await database().run(
        `
          INSERT OR IGNORE INTO cron (${sql.columns}) VALUES (${sql.marks})
        `,
        sql.values
      );
    }
  }
};
