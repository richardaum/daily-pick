import 'dotenv-flow/config';
import 'tsconfig-paths/register';
import '@/exception';

import { startServer } from '@/bootstrap/start';

startServer();
