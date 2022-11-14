import { BlockAction, OverflowAction, RespondFn } from '@slack/bolt';
import { Blocks, Elements, Surfaces } from 'slack-block-builder';

import { DELETE_MESSAGE_ACTION } from '@/constants';
import { BACK_TO_LIST_ACTION } from '@/constants/actions';
import { BACK_TO_LIST, DELETE_MESSAGE } from '@/i18n';
import { repository } from '@/services/repository';

export const seeDetails = async ({
  body,
  cronId,
  respond,
}: {
  body: BlockAction<OverflowAction>;
  cronId: string;
  respond: RespondFn;
}) => {
  const cron = await repository.fetchCronById(cronId);
  if (!cron) throw new Error(`The cron ${cronId} was not found`);

  respond(
    Surfaces.Message({ text: 'Cron details' })
      .blocks([
        Blocks.Section({ text: `Id: ${cron.id}` }),
        Blocks.Section({ text: `Nome: ${cron.name}` }),
        Blocks.Section({ text: `Horários: ${cron.intervals}` }),
        Blocks.Section({ text: `Participantes: ${cron.users.map((user) => `<@${user}>`).join(', ')}` }),
        Blocks.Actions().elements(
          Elements.Button({ text: BACK_TO_LIST, actionId: BACK_TO_LIST_ACTION }),
          Elements.Button({ text: DELETE_MESSAGE, actionId: DELETE_MESSAGE_ACTION })
        ),
      ])
      .buildToObject()
  );
};
