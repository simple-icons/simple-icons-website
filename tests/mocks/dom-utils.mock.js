export const domUtils = {
  hideElement: jest.fn().mockName('domUtils.hideElement'),
  showElement: jest.fn().mockName('domUtils.showElement'),
  toggleClass: jest.fn().mockName('domUtils.toggleClass'),
  addClass: jest.fn().mockName('domUtils.addClass'),
  removeClass: jest.fn().mockName('domUtils.removeClass'),
  // Utility to quickly clear the entire dom-utils mock.
  __resetAllMocks: function () {
    this.hideElement.mockReset();
    this.showElement.mockReset();
    this.toggleClass.mockReset();
    this.addClass.mockReset();
    this.removeClass.mockReset();
  },
};
