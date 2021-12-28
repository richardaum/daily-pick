import { fieldsToExpression, CronFields as RawCronFields } from 'cron-parser';
import { mocked } from 'jest-mock';
import schedule, { Job, RecurrenceRule } from 'node-schedule';

import { scheduleSingle } from '.';

describe('scheduleSingle', () => {
  it('should properly parse interval to RecurrenceRule', async () => {
    jest.spyOn(schedule, 'scheduleJob').mockImplementation(() => null as unknown as Job);

    const interval = '0 27 18 * * TUE';
    scheduleSingle('cronId', interval, () => null);

    const calls = mocked(schedule.scheduleJob).mock.calls;
    const fields = calls[0][1] as unknown as RecurrenceRule;
    const express = fieldsToExpression({ ...fields, dayOfMonth: fields.date } as RawCronFields);
    const cron = express.stringify();

    expect(cron).toContain('27 18 * * 2');
  });
});
