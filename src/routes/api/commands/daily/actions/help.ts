import { Response } from 'express';
import { Blocks, Surfaces } from 'slack-block-builder';

import { Request } from '../utils/types';

import { AVAILABLE_COMMANDS, MORE_INFO, TO_ADD_A_NEW_CRON, TO_LIST_CRONS } from '@/i18n';

export function help(_: Request, res: Response) {
  const view = Surfaces.Message()
    .blocks(
      Blocks.Header({ text: AVAILABLE_COMMANDS }),
      Blocks.Section({ text: [TO_ADD_A_NEW_CRON, '`/daily pick`\n'].join('\n') }),
      Blocks.Section({ text: [TO_LIST_CRONS, '`/daily list`'].join('\n') }),
      Blocks.Section({ text: MORE_INFO })
    )
    .buildToObject();
  res.json(view);
}
