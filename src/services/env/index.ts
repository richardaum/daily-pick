const config = {
  PORT: process.env.PORT || '3333',
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
  PRETTY_LOG_DISABLED: process.env.PRETTY_LOG_DISABLED || '',
};

export const env = (key: keyof typeof config) => {
  const value = config[key] ?? process.env[key];
  if (value == null) throw new Error(`Missing required environment variable ${key}`);
  return value;
};

process.env.PORT;
