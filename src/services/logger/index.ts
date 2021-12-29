import bunyan from 'bunyan';

export function createLogger() {
  const logger = bunyan.createLogger({
    name: 'daily-pick',
    src: true,
    streams: [{ stream: process.stdout, level: 'info' }],
  });
  return logger;
}
