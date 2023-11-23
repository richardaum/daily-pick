import 'dotenv-flow/config';
import 'tsconfig-paths/register';
import '@/exception';

import { migrateFirebaseToPostgresql } from '@/services/migration/firebase-to-postgresql';

migrateFirebaseToPostgresql();
