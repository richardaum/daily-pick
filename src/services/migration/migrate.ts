import 'dotenv-flow/config';
import 'tsconfig-paths/register';
import '@/exception';

import { migrateFirebaseToSqlite3 } from '@/services/migration/firebase-to-sqlite3';

migrateFirebaseToSqlite3();
