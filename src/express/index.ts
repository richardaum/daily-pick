import express from 'express';

export const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} > ${res.statusCode}`);
  next();
});
