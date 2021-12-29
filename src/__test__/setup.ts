beforeEach(() => {
  jest.resetModules();
});

jest.mock('@/services/database', () => null);
jest.mock('@/services/slack', () => null);
