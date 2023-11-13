import { buildCronToSQLite } from '../../../cron/index';

import { database } from '@/services/repository/sqlite';
import { Cron, Repository } from '@/types';

export const updateCron: Repository['updateCron'] = async (cron) => {
  let query = '';
  let values: Partial<Cron> = {};

  const formattedCron = buildCronToSQLite(cron);

  for (const k of Object.keys(formattedCron)) {
    const key = k as keyof typeof formattedCron;

    if (key !== 'id') {
      query = [query, `${key} = :${key}`].filter(Boolean).join(', ');
    }

    values = { ...values, [`:${key}`]: formattedCron[key] };
  }

  await database().run(
    `
      UPDATE cron 
      SET ${query}
      WHERE id = :id
    `,
    values
  );

  return cron;
};
