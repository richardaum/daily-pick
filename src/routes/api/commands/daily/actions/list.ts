import { SlashCommand } from '@slack/bolt';
import { Response } from 'express';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { Request, SlashCommandRequest } from '../utils/types';

import { BY_CREATION_DATE, CLOSE_LIST, CRONS, NO_CRONS_FOUND, REMOVE } from '@/i18n';
import { fetchCronsByChannelAndTeam } from '@/services/database/functions/fetchCronsByChannelAndTeam';
import { PersistedCron } from '@/types';

export const isListingCrons = (req: Request): req is SlashCommandRequest => {
  const body = req.body as SlashCommand;
  return body.text === 'list';
};

export const listCrons = async (req: SlashCommandRequest, res: Response) => {
  const crons = await fetchCronsByChannelAndTeam(req.body.channel_id, req.body.team_id);
  const message = listCronsView(crons).buildToObject();
  res.json(message);
};

export const listCronsView = (crons: PersistedCron[]) =>
  Surfaces.Message()
    .ephemeral(true)
    .blocks(
      Blocks.Section({ text: `*${CRONS}* (${BY_CREATION_DATE}):` }),
      Blocks.Divider(),
      ...crons.map((cron) =>
        Blocks.Section({
          text: `:calendar: *${cron.name}*`,
        }).accessory(
          Elements.Button({
            actionId: 'remove',
            value: cron.id,
            text: REMOVE,
          }).danger()
        )
      ),
      ...(() => {
        if (crons.length > 0) return [];
        return [Blocks.Section({ text: NO_CRONS_FOUND })];
      })(),
      Blocks.Actions().elements(
        Elements.Button({
          text: CLOSE_LIST,
          actionId: 'close_list',
        })
      )
    );
