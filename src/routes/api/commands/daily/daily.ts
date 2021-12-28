import { Response } from 'express';

import { closeList, isClosingList } from './isClosingList';
import { isDaily, updateModalRepeatDaily } from './isDaily';
import { isListingCrons, listCrons } from './list';
import { isRequestingToOpenModal, openModal } from './openModal';
import { isSubmitting, submit } from './submit';
import { Request } from './utils/types';

import { api } from '@/services/express';

api.post('/api/commands/daily/pick', async (req: Request, res) => {
  if (isListingCrons(req)) return await listCrons(req, res);
  if (isRequestingToOpenModal(req)) return await openModal(req, res);
  res.send("I didn't understand that command.");
});

api.post('/api/commands/daily/act', async (req: Request, res: Response) => {
  if (isClosingList(req)) return await closeList(req, res);
  if (isDaily(req)) return await updateModalRepeatDaily(req, res);
  if (isSubmitting(req)) return await submit(req, res);
  res.send("I didn't understand that action.");
});
