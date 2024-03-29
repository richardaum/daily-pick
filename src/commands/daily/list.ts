import { RespondFn, SlashCommand } from '@slack/bolt';
import { Blocks, Elements, Option, Surfaces } from 'slack-block-builder';

import { DELETE_MESSAGE_ACTION, LIST_OVERFLOW_SETTINGS_ACTION, REMOVE_CRON_ACTION, TRIGGER_ACTION } from '@/constants';
import { BY_CREATION_DATE, CRONS, DELETE_MESSAGE, LIST_SETTINGS, NO_CRONS_FOUND, REMOVE, TRIGGER } from '@/i18n';
import { repository } from '@/services/repository';

export const isListingCrons = (command: SlashCommand) => {
  return command.text === 'list';
};

export const listCrons = async (body: SlashCommand, respond: RespondFn) => {
  const crons = await repository.fetchCronsByChannelAndTeam(body.channel_id, body.team_id);
  const message = listCronsView(crons).buildToObject();
  await respond(message);
};

type PartialCron = {
  name: string;
  id: string;
};

export const listCronsView = (crons: PartialCron[]) =>
  Surfaces.Message()
    .text(crons.map((cron) => `:calendar: *${cron.name}*`).join(', '))
    .ephemeral(true)
    .blocks(
      Blocks.Section({ text: `*${CRONS}* (${BY_CREATION_DATE}):` }),
      Blocks.Divider(),
      ...crons.map((cron) =>
        Blocks.Section({
          text: `:calendar: *${cron.name}*`,
        }).accessory(
          Elements.OverflowMenu({ actionId: 'list_overflow_click' })
            .options([
              Option({ value: `${REMOVE_CRON_ACTION}#${cron.id}`, text: REMOVE }),
              Option({ value: `${LIST_OVERFLOW_SETTINGS_ACTION}#${cron.id}`, text: LIST_SETTINGS }),
              Option({ value: `${TRIGGER_ACTION}#${cron.id}`, text: TRIGGER }),
            ])
            .end()
        )
      ),
      ...(() => {
        if (crons.length > 0) return [];
        return [Blocks.Section({ text: NO_CRONS_FOUND })];
      })(),
      Blocks.Actions().elements(
        Elements.Button({
          text: DELETE_MESSAGE,
          actionId: DELETE_MESSAGE_ACTION,
        })
      )
    );
