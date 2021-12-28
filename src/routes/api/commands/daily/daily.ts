import { Response } from 'express';

import { closeList, isClosingList } from './closeList';
import { createCron, isCreatingCron } from './createCron';
import { help } from './help';
import { isListingCrons, listCrons } from './list';
import { isOpeningModal, openModal } from './openModal';
import { isRemovingCron, removeCron } from './removeCron';
import { Request } from './utils/types';

import { api } from '@/services/express';

api.post('/api/commands/daily/pick', async (req: Request, res) => {
  if (isListingCrons(req)) return await listCrons(req, res);
  if (isOpeningModal(req)) return await openModal(req, res);
  await help(req, res);
});

api.post('/api/commands/daily/act', async (req: Request, res: Response) => {
  if (isRemovingCron(req)) return await removeCron(req, res);
  if (isClosingList(req)) return await closeList(req, res);
  if (isCreatingCron(req)) return await createCron(req, res);
  res.send("I didn't understand that action.");
});
