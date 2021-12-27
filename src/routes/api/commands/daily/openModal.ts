import { Response } from 'express';
import { Blocks, Elements, Modal, Option } from 'slack-block-builder';

import { Request, SlashCommandRequest } from './utils/types';

import { slack } from '@/services/slack';

export function isRequestingToOpenModal(req: Request): req is SlashCommandRequest {
  return 'trigger_id' in req.body;
}

export async function openModal(req: SlashCommandRequest, res: Response) {
  const modal = Modal({
    callbackId: 'openModal',
    title: 'Daily Pick',
    submit: 'Submit',
    privateMetaData: req.body.channel_id,
  })
    .blocks(...openModalBlocks())
    .buildToObject();

  await slack.client.views.open({
    trigger_id: req.body.trigger_id,
    view: modal,
  });

  res.end();
}

export function openModalBlocks() {
  return [
    Blocks.Input({ label: 'Select users', blockId: 'participants' }).element(
      Elements.UserMultiSelect({ actionId: 'participants_select', placeholder: 'Pick users here' })
    ),
    Blocks.Input({ label: 'Repeat', blockId: 'repeat' })
      .dispatchAction(true)
      .element(Elements.StaticSelect({ actionId: 'repeat_select' }).options(Option({ text: 'Daily', value: 'daily' }))),
  ];
}
