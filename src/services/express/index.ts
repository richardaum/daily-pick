import express from 'express';

import { setupSentry } from '../error-tracking';


export const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: true }));



setupSentry(api);
