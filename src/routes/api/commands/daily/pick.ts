import { help } from './actions/help';
import { isListingCrons, listCrons } from './actions/list';
import { isOpeningModal, openModal } from './actions/openModal';
import { Request } from './utils/types';

import { api } from '@/services/express';

api.post('/api/commands/daily/pick', async (req: Request, res) => {
  if (isListingCrons(req)) return await listCrons(req, res);
  if (isOpeningModal(req)) return await openModal(req, res);
  await help(req, res);
});
