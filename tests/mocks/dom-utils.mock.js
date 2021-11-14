export const domUtils = {
  hideElement: jest.fn().mockName('domUtils.hideElement'),
  showElement: jest.fn().mockName('domUtils.showElement'),
  toggleVisibleElement: jest.fn().mockName('domUtils.toggleVisibleElement'),
  sortChildren: jest.fn().mockName('domUtils.sortChildren'),
  // Utility to quickly clear the entire dom-utils mock.
  __resetAllMocks: function () {
    this.hideElement.mockReset();
    this.showElement.mockReset();
    this.toggleVisibleElement.mockReset();
    this.sortChildren.mockReset();
  },
};
