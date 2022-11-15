import { migrateFirebaseToSqlite3 } from '@/services/migration/firebase-to-sqlite3';

export const migrate = async () => {
  await migrateFirebaseToSqlite3();
};
