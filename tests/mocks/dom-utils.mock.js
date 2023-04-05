import { jest } from '@jest/globals';

export default {
  hideElement: jest.fn().mockName('domUtils.hideElement'),
  showElement: jest.fn().mockName('domUtils.showElement'),
  toggleClass: jest.fn().mockName('domUtils.toggleClass'),
  toggleVisibleElement: jest.fn().mockName('domUtils.toggleVisibleElement'),
  sortChildren: jest.fn().mockName('domUtils.sortChildren'),
  replaceChildren: jest.fn().mockName('domUtils.replaceChildren'),
  // Utility to quickly clear the entire dom-utils mock.
  __resetAllMocks: function () {
    this.hideElement.mockReset();
    this.showElement.mockReset();
    this.toggleClass.mockReset();
    this.toggleVisibleElement.mockReset();
    this.sortChildren.mockReset();
    this.replaceChildren.mockReset();
  },
};
