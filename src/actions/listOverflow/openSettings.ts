import { RespondFn } from '@slack/bolt';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { DELETE_MESSAGE_ACTION, EDIT_SCHEDULE_ACTION } from '@/constants';
import { BACK_TO_LIST_ACTION } from '@/constants/actions';
import { BACK_TO_LIST, DELETE_MESSAGE, EDIT } from '@/i18n';
import { repository } from '@/services/repository';
import { Cron } from '@/types';

export const openSettings = async ({ cronId, respond }: { cronId: string; respond: RespondFn }) => {
  const cron = await repository.fetchCronById(cronId);
  if (!cron) throw new Error(`The cron ${cronId} was not found`);

  await respond(settingsView(cron));
};

const section = (title: string, content?: string) => `*${title}* \n ${content ?? ''}`;
const code = (code: string) => `\`${code}\``;

export const settingsView = (cron: Cron) => {
  return Surfaces.Message({ text: 'Cron details' })
    .blocks([
      Blocks.Section({ text: section('Id', code(cron.id)) }),
      Blocks.Section({ text: section('Nome', cron.name) }),
      Blocks.Section({ text: section('Mensagem', code(cron.message ?? 'N/A')) }),
      Blocks.Section({ text: section('Horários', code(cron.intervals.join(', '))) }),
      Blocks.Section({ text: section('Participantes') }),
      Blocks.Section({ text: cron.users.map((user) => `<@${user}>`).join(', ') }),
      Blocks.Section({ text: `Atual: <@${cron.current}>` }),
      Blocks.Actions().elements(
        Elements.Button({ text: BACK_TO_LIST, actionId: BACK_TO_LIST_ACTION }),
        Elements.Button({
          text: EDIT,
          actionId: EDIT_SCHEDULE_ACTION,
          value: JSON.stringify({ c: cron.id }),
        }),
        Elements.Button({ text: DELETE_MESSAGE, actionId: DELETE_MESSAGE_ACTION })
      ),
    ])
    .buildToObject();
};
