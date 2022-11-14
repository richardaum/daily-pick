import { ITS_YOUR_TURN, NEXT_TIME } from '@/i18n';
import { PostMessageNamedParams } from '@/types';

const DEFAULT_MESSAGE = [
  `:tada: {currentUserMention}, ${ITS_YOUR_TURN} :calendar:`,
  `:black_right_pointing_double_triangle_with_vertical_bar: ${NEXT_TIME}, {nextUserName}. :tada:`,
].join('\n');

const VARIABLES: Record<string, (p: PostMessageNamedParams) => string> = {
  '{currentUserMention}': (p) => p.current,
  '{nextUserName}': (p) => p.next,
};

export const applyVariables = (message: string, params: PostMessageNamedParams): string => {
  let replaced = message;
  for (const variable of Object.keys(VARIABLES)) {
    const regexp = new RegExp(variable, 'g');
    const build = VARIABLES[variable];
    replaced = replaced.replace(regexp, build(params));
  }
  return replaced;
};

export const getMessage = (message?: string) => {
  return message ?? DEFAULT_MESSAGE;
};
