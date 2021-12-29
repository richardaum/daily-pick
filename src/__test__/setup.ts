beforeEach(() => {
  jest.resetModules();
});

function noop() {
  /*  */
}

jest.mock('@/services/database', noop);
jest.mock('@/services/slack');
