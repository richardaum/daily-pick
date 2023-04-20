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

export const TRACE = 5;
export const DEBUG = 4;
export const INFO = 3;
export const WARN = 2;
export const ERROR = 1;
export const FATAL = 0;

const LEVELS = new Map([
  ['fatal', FATAL],
  ['error', ERROR],
  ['warn', WARN],
  ['info', INFO],
  ['debug', DEBUG],
  ['trace', TRACE],
]);

export function getLogLevel(): number {
  const logLevel = `${env('LOG_LEVEL')}`;
  return Number(LEVELS.get(logLevel));
}
