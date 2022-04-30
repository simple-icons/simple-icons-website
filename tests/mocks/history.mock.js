import { jest } from '@jest/globals';

export default {
  replaceState: jest.fn().mockName('history.replaceState'),

  // Utility to quickly clear the entire history mock.
  __resetAllMocks: function () {
    this.replaceState.mockReset();
  },
};
