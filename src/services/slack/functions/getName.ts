import { BotsInfoResponse, UsersInfoResponse } from '@slack/web-api';

import { app } from '..';

export const getName = async (users: string[]): Promise<string[]> => {
  return Promise.all(
    users.map(async (id) => {
      const response = await Promise.all([
        app.client.users.info({ user: id }).catch((e) => e),
        app.client.bots.info({ bot: id }).catch((e) => e),
      ]);

      const [userInfo, botInfo] = response as [UsersInfoResponse, BotsInfoResponse];
      const name = userInfo?.user?.real_name ?? botInfo?.bot?.name;
      return name ?? id;
    })
  );
};
