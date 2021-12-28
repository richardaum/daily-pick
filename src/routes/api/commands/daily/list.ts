import { SlashCommand } from '@slack/bolt';
import { Response } from 'express';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { Request, SlashCommandRequest } from './utils/types';

import { fetchCrons } from '@/services/database/crons';

export const isListingCrons = (req: Request): req is SlashCommandRequest => {
  const body = req.body as SlashCommand;
  return body.text === 'list';
};

export const listCrons = async (_: SlashCommandRequest, res: Response) => {
  const crons = await fetchCrons();
  const message = Surfaces.Message()
    .ephemeral(true)
    .blocks(
      ...crons.map((cron) =>
        Blocks.Section({
          text: `:calendar: *${cron.createdAt}*`,
        }).accessory(
          Elements.Button({
            actionId: 'remove',
            value: cron.id,
            text: 'Remover',
          })
        )
      ),
      Blocks.Divider(),
      Blocks.Actions().elements(
        Elements.Button({
          text: `Fechar lista`,
          actionId: 'close_list',
        })
      )
    )
    .buildToObject();

  res.json(message);
};
