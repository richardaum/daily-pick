import { omit } from 'lodash';

import { connectFirebase, firebaseRepository } from '@/services/repository/firebase';
import { connectPostgresql, database } from '@/services/repository/postgresql';

export const migrateFirebaseToPostgresql = async () => {
  connectFirebase();
  const disconnect = await connectPostgresql();

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
      (sql, [key, value], index) => {
        return {
          marks: [...sql.marks, `$${index + 1}`],
          columns: [...sql.columns, `"${key}"`],
          values: [...sql.values, value],
        };
      },
      { columns: [], marks: [], values: [] } as {
        columns: string[];
        marks: string[];
        values: (string | null | undefined)[];
      }
    );

    await database().query(
      `INSERT INTO cron (${sql.columns.join(', ')}) VALUES (${sql.marks.join(', ')}) ON CONFLICT DO NOTHING`,
      sql.values
    );
  }

  await disconnect();
};
