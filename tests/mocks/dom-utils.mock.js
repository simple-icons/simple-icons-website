export const domUtils = {
  hideElement: jest.fn().mockName('domUtils.hideElement'),
  showElement: jest.fn().mockName('domUtils.showElement'),
  toggleVisibleElement: jest.fn().mockName('domUtils.toggleVisibleElement'),
  sortChildren: jest.fn().mockName('domUtils.sortChildren'),
  toggleClass: jest.fn().mockName('domUtils.toggleClass'),
  addClass: jest.fn().mockName('domUtils.addClass'),
  removeClass: jest.fn().mockName('domUtils.removeClass'),
  // Utility to quickly clear the entire dom-utils mock.
  __resetAllMocks: function () {
    this.hideElement.mockReset();
    this.showElement.mockReset();
    this.toggleVisibleElement.mockReset();
    this.sortChildren.mockReset();
    this.toggleClass.mockReset();
    this.addClass.mockReset();
    this.removeClass.mockReset();
    this.toggleVisibleElement.mockReset();
    this.sortChildren.mockReset();
  },
};
