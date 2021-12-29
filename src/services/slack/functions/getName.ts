import { slack } from '..';

export const getName = async (users: string[]) => {
  return Promise.all(
    users.map(async (id) => {
      const [userInfo, botInfo] = await Promise.all([
        slack.client.users.info({ user: id }).catch((e) => e),
        slack.client.bots.info({ bot: id }).catch((e) => e),
      ]);

      const mayBeUserOrBot = userInfo?.user ?? botInfo?.bot;
      return mayBeUserOrBot?.real_name ?? id;
    })
  );
};
