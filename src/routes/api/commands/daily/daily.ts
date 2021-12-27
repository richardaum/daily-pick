import { isDaily, updateModalRepeatDaily } from './isDaily';
import { isRequestingToOpenModal, openModal } from './openModal';
import { isSubmitting, submit } from './submit';
import { Request } from './utils/types';

import { api } from '@/services/express';

api.post('/api/commands/daily/pick', async (req: Request, res) => {
  if (isRequestingToOpenModal(req)) return await openModal(req, res);
  res.send("I didn't understand that command.");
});

api.post('/api/commands/daily/act', async (req: Request, res) => {
  if (isDaily(req)) return await updateModalRepeatDaily(req, res);
  if (isSubmitting(req)) return await submit(req, res);
  res.send("I didn't understand that action.");
});
