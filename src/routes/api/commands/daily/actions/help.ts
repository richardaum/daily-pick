import { Response } from 'express';
import { Blocks, Surfaces } from 'slack-block-builder';

import { Request } from '../utils/types';

export function help(_: Request, res: Response) {
  const view = Surfaces.Message()
    .blocks(
      Blocks.Header({ text: 'Comandos disponíveis:' }),
      Blocks.Section({ text: [`Para adicionar um novo agendamento:`, '`/daily pick`\n'].join('\n') }),
      Blocks.Section({ text: [`Para listar os agendamentos já criados:`, '`/daily list`'].join('\n') })
    )
    .buildToObject();
  res.json(view);
}
