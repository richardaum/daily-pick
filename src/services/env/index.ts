const config = {
  PORT: process.env.PORT || '3333',
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
  LOG_DISABLED: process.env.LOG_DISABLED,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
};

const optional = new Set(['LOG_DISABLED', 'SENTRY_DSN', 'LOG_LEVEL']);

export const env = (key: keyof typeof config) => {
  const value = config[key];
  if (value == null && !optional.has(key)) throw new Error(`Missing required environment variable ${key}`);
  return value;
};

process.env.PORT;
