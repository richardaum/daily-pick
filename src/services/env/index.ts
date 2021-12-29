const config = {
  PORT: process.env.PORT || '3333',
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
  LOG_DISABLED: process.env.LOG_DISABLED,
  GOOGLE_CLOUD_LOGGING_BUNYAN_ENABLED: process.env.GOOGLE_CLOUD_LOGGING_BUNYAN_ENABLED,
};

const required = new Set(['PORT', 'FIREBASE_CONFIG']);

export const env = (key: keyof typeof config) => {
  const value = config[key] ?? process.env[key];
  if (value == null && required.has(key)) throw new Error(`Missing required environment variable ${key}`);
  return value;
};

process.env.PORT;
