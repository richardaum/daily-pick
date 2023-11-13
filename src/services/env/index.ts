const config = {
  PORT: process.env.PORT || '3333',
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
  LOG_DISABLED: process.env.LOG_DISABLED,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  DATABASE: process.env.DATABASE,
  SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN,
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  FIREBASE_TO_SQLITE_MIGRATION_TIMESTAMP: process.env.FIREBASE_TO_SQLITE_MIGRATION_TIMESTAMP,
  FIREBASE_TO_SQLITE_MIGRATION_ENABLED: process.env.FIREBASE_TO_SQLITE_MIGRATION_ENABLED as string,
  PG_HOST: process.env.PG_HOST,
  PG_USER: process.env.PG_USER,
  PG_PASSWORD: process.env.PG_PASSWORD,
};

const optional = new Set<keyof typeof config>([
  'LOG_DISABLED',
  'SENTRY_DSN',
  'LOG_LEVEL',
  'FIREBASE_TO_SQLITE_MIGRATION_TIMESTAMP',
  'FIREBASE_TO_SQLITE_MIGRATION_ENABLED',
]);

export const env = <Key extends keyof typeof config>(key: Key) => {
  const value = config[key];
  if (value == null && !optional.has(key)) throw new Error(`Missing required environment variable ${key}`);
  return value;
};
