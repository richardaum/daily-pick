import { resolve } from 'path';

import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

import { createLogger, DEBUG, getLogLevel } from '@/services/logger';

let instance: Database<sqlite3.Database, sqlite3.Statement>;

const logger = createLogger();

export const database = () => {
  if (!instance) throw new Error('SQLite is being accessed before instantiated');
  return instance;
};

export const connectSqlite = async () => {
  const database = await open({
    filename: './database.sqlite3',
    driver: sqlite3.Database,
  });

  await database.migrate({
    migrationsPath: resolve(__dirname, 'migrations'),
  });

  if (getLogLevel() >= DEBUG) {
    sqlite3.verbose();

    database.on('trace', function (sql: string) {
      logger.debug(sql);
    });
  }

  instance = database;
};

export { sqliteRepository } from './functions';
