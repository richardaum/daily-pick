import { Response } from 'express';

import { closeList, isClosingList } from './actions/closeList';
import { createCron, isCreatingCron } from './actions/createCron';
import { isRemovingCron, removeCron } from './actions/removeCron';
import { Request } from './utils/types';

import { api } from '@/services/express';

api.post('/api/commands/daily/act', async (req: Request, res: Response) => {
  if (isRemovingCron(req)) return await removeCron(req, res);
  if (isClosingList(req)) return await closeList(req, res);
  if (isCreatingCron(req)) return await createCron(req, res);
  res.send("I didn't understand that action.");
});
