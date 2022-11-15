import { resolve } from 'path';

import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

import { env } from '@/services/env';

let instance: Database<sqlite3.Database, sqlite3.Statement>;

export const database = () => {
  if (!instance) throw new Error('SQLite is being accessed before instantiated');
  return instance;
};

export const connectSqlite = async () => {
  const sqlite = sqlite3.verbose();

  const database = await open({
    filename: './database.sqlite3',
    driver: sqlite.Database,
  });

  await database.migrate({
    migrationsPath: resolve(__dirname, 'migrations'),
  });

  instance = database;
};

export { sqliteRepository } from './functions';
