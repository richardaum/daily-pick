beforeEach(() => {
  jest.resetModules();
});

function noop() {
  /*  */
}

jest.mock('@/services/repository', noop);
jest.mock('@/services/slack');
