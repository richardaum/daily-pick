import { Response } from 'express';

import { closeList, isClosingList } from './closeList';
import { isListingCrons, listCrons } from './list';
import { isRequestingToOpenModal, openModal } from './openModal';
import { isRemovingCron, removeCron } from './removeCron';
import { isSubmitting, submit } from './submit';
import { Request } from './utils/types';

import { api } from '@/services/express';

api.post('/api/commands/daily/pick', async (req: Request, res) => {
  if (isListingCrons(req)) return await listCrons(req, res);
  if (isRequestingToOpenModal(req)) return await openModal(req, res);
  res.send("I didn't understand that command.");
});

api.post('/api/commands/daily/act', async (req: Request, res: Response) => {
  if (isRemovingCron(req)) return await removeCron(req, res);
  if (isClosingList(req)) return await closeList(req, res);
  if (isSubmitting(req)) return await submit(req, res);
  res.send("I didn't understand that action.");
});
