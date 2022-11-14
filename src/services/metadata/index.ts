import { createLogger } from '@/services/logger';

const logger = createLogger();

type Metadata = { c: string; r: string };

export const serializeMetadata = (metadata: Metadata) => {
  const serialized = JSON.stringify(metadata);
  if (serialized.length >= 300) logger.error('The metadata provided is too large to be sent.');
  return serialized;
};

export const parseMetadata = (serialized: string) => {
  return JSON.parse(serialized) as Metadata;
};
