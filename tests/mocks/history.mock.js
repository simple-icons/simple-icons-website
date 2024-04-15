import {jest} from '@jest/globals';

const mock = {
  replaceState: jest.fn().mockName('history.replaceState'),

  // Utility to quickly clear the entire history mock.
  __resetAllMocks() {
    this.replaceState.mockReset();
  },
};

export default mock;
