import { buildCreatedAt } from '../../common/buildCreatedAt';

describe('buildCreatedAt', () => {
  it('should return a date string', () => {
    const date = new Date('2021-12-28T23:34:27.381Z');
    const result = buildCreatedAt(date);
    expect(result).toBe('2021-12-28T20:34:27.381-03:00');
  });
});
