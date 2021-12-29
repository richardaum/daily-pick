import express from 'express';

import { createLogger } from '../logger';

const logger = createLogger();

export const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, statusCode: res.statusCode });
  next();
});
