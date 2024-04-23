import {jest} from '@jest/globals';

const mock = {
  currentOrderingIs: jest.fn().mockName('ordering.currentOrderingIs'),
  selectOrdering: jest.fn().mockName('ordering.selectOrdering'),
  resetOrdering: jest.fn().mockName('ordering.resetOrdering'),

  // Utility to quickly clear the entire ordering mock.
  __resetAllMocks() {
    this.currentOrderingIs.mockReset();
    this.selectOrdering.mockReset();
    this.resetOrdering.mockReset();
  },
};

export default mock;
