import { SlashCommand } from '@slack/bolt';
import { Response } from 'express';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { Request, SlashCommandRequest } from '../utils/types';

import { fetchCronsByChannelAndTeam } from '@/services/database/crons';
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
      Blocks.Section({ text: '*Agendamentos* (por data de criação):' }),
      Blocks.Divider(),
      ...crons.map((cron) =>
        Blocks.Section({
          text: `:calendar: *${cron.createdAt}*`,
        }).accessory(
          Elements.Button({
            actionId: 'remove',
            value: cron.id,
            text: 'Remover',
          }).danger()
        )
      ),
      ...(() => {
        if (crons.length > 0) return [];
        return [Blocks.Section({ text: 'Nenhum agendamento encontrado' })];
      })(),
      Blocks.Actions().elements(
        Elements.Button({
          text: `Fechar lista`,
          actionId: 'close_list',
        })
      )
    );
