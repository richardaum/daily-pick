CREATE TABLE IF NOT EXISTS cron (
  id STRING NOT NULL PRIMARY KEY,
  current STRING NULL,
  intervals STRING NOT NULL,
  name STRING NOT NULL,
  team STRING NOT NULL,
  users STRING NOT NULL,
  createTime STRING NOT NULL,
  channel STRING NULL
)