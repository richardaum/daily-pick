import { createLogger } from '@/services/logger';

const logger = createLogger();
const handle = (error: Error) => logger.error(error);
process.on('uncaughtException', handle);
process.on('unhandledRejection', handle);
