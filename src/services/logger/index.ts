import pino from 'pino';

import { env } from '@/services/env';

const isoTime = () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`;

export function createLogger() {
  return pino({
    level: env('LOG_LEVEL') ?? 'info',
    base: { service_name: 'ifood-daily-pick' },
    messageKey: 'message',
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: isoTime,
  });
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
