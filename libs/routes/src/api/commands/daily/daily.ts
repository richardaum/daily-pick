import { api } from '@daily-pick/express';
import { isSubmitting, submit } from './submit';
import { isRequestingToOpenModal, openModal } from './openModal';
import { Request } from './types';
import { isGoingToRepeatEveryWeekView, updateModalRepeatEveryWeek } from './updateModalRepeatEveryWeek';

api.post('/api/commands/daily/pick', async (req: Request, res) => {
  if (isRequestingToOpenModal(req)) return await openModal(req, res);
  if (isGoingToRepeatEveryWeekView(req)) return await updateModalRepeatEveryWeek(req, res);
  if (isSubmitting(req)) return await submit(req, res);
  res.send("I didn't understand that command.");
});
