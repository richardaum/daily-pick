export const slack = {
  client: {
    views: {
      open: jest.fn(),
    },
    chat: {
      postEphemeral: jest.fn(),
    },
  },
};
