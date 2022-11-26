import { BlockAction, OverflowAction, RespondFn } from '@slack/bolt';
import { Blocks, Elements, SectionBuilder, Surfaces } from 'slack-block-builder';

import { ADD_PARTICIPANT_ACTION, DELETE_MESSAGE_ACTION, REMOVE_PARTICIPANT_ACTION } from '@/constants';
import { BACK_TO_LIST_ACTION } from '@/constants/actions';
import { ADD_PARTICIPANT, BACK_TO_LIST, DELETE_MESSAGE, REMOVE_PARTICIPANT } from '@/i18n';
import { repository } from '@/services/repository';
import { Cron } from '@/types';

export const seeDetails = async ({
  cronId,
  respond,
}: {
  body: BlockAction<OverflowAction>;
  cronId: string;
  respond: RespondFn;
}) => {
  const cron = await repository.fetchCronById(cronId);
  if (!cron) throw new Error(`The cron ${cronId} was not found`);

  await respond(detailsView(cron));
};

export const detailsView = (cron: Cron) => {
  return Surfaces.Message({ text: 'Cron details' })
    .blocks([
      Blocks.Section({ text: `Id: ${cron.id}` }),
      Blocks.Section({ text: `Nome: ${cron.name}` }),
      Blocks.Section({ text: `Horários: ${cron.intervals.join(', ')}` }),
      Blocks.Section({ text: `Participants:` }),
      ...cron.users.map((user) => maybeAddRemoveButton(cron, user, Blocks.Section({ text: `<@${user}>` }))),
      Blocks.Section({ text: `Atual: <@${cron.current}>` }),
      Blocks.Actions().elements(
        Elements.Button({ text: BACK_TO_LIST, actionId: BACK_TO_LIST_ACTION }),
        Elements.Button({
          text: ADD_PARTICIPANT,
          actionId: ADD_PARTICIPANT_ACTION,
          value: JSON.stringify({ c: cron.id }),
        }),
        Elements.Button({ text: DELETE_MESSAGE, actionId: DELETE_MESSAGE_ACTION })
      ),
    ])
    .buildToObject();
};
function maybeAddRemoveButton(cron: Cron, user: string, element: SectionBuilder): SectionBuilder {
  if (cron.users.length <= 1) return element;

  return element.accessory(
    Elements.Button({
      text: REMOVE_PARTICIPANT,
      actionId: REMOVE_PARTICIPANT_ACTION,
      value: JSON.stringify({ u: user, c: cron.id }),
    }).danger()
  );
}
