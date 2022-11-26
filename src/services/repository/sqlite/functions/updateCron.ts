import { database } from '@/services/repository/sqlite';
import { Cron, Repository } from '@/types';

export const updateCron: Repository['updateCron'] = async (cron) => {
  let query = '';
  let values: Partial<Cron> = {};

  for (const k of Object.keys(cron)) {
    const key = k as keyof typeof cron;

    if (key !== 'id') {
      query = [query, `${key} = :${key}`].join(', ');
    }

    values = { ...values, [`:${key}`]: cron[key] };
  }

  await database().run(
    `
      UPDATE cron 
      SET ${query}
      WHERE id = :id
    `,
    values
  );
};
