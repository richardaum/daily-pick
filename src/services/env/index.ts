const config = {
  PORT: process.env.PORT || '3333',
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
  LOG_DISABLED: process.env.LOG_DISABLED,
};

const optional = new Set(['LOG_DISABLED']);

export const env = (key: keyof typeof config) => {
  const value = config[key] ?? process.env[key];
  if (value == null && !optional.has(key)) throw new Error(`Missing required environment variable ${key}`);
  return value;
};

process.env.PORT;
