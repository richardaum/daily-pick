import { resolve } from 'path';

import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

import * as functions from './functions';

import { Repository } from '@/types';

let instance: Database<sqlite3.Database, sqlite3.Statement>;

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

  instance = database;
};

export const sqliteRepository = functions as Repository;
