CREATE TABLE IF NOT EXISTS cron (
  id TEXT NOT NULL PRIMARY KEY,
  current TEXT NULL,
  intervals TEXT NOT NULL,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  users TEXT NOT NULL,
  createTime TEXT NOT NULL,
  channel TEXT NULL
);