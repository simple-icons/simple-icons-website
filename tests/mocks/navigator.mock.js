import {jest} from '@jest/globals';

const mock = {
  clipboard: {
    writeText: jest.fn().mockName('navigator.clipboard.writeText'),
  },

  // Utility to quickly clear the entire localStorage mock.
  __resetAllMocks() {
    this.clipboard.writeText.mockReset();
  },
};

export default mock;
