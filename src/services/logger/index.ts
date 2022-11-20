import bunyan, { LogLevel } from 'bunyan';

import { env } from '@/services/env';

export function createLogger() {
  const logger = bunyan.createLogger({
    name: 'daily-pick',
    src: true,
    streams: [{ stream: process.stdout, level: (env('LOG_LEVEL') as LogLevel) ?? 'info' }],
  });

  if (env('LOG_DISABLED') === 'true') {
    logger.level(bunyan.FATAL + 1);
  }

  return logger;
}

const LEVELS = Object.entries(['fatal', 'error', 'warn', 'info', 'debug', 'trace']);

export const TRACE = 5;
export const DEBUG = 4;
export const INFO = 3;
export const WARN = 2;
export const ERROR = 1;
export const FATAL = 0;

export function getLogLevel(): number {
  const levels = new Map<string, string>(LEVELS);
  const logLevel = `${env('LOG_LEVEL')}`;
  return Number(levels.get(logLevel));
}
