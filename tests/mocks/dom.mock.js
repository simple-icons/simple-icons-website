export function newElementMock() {
  return {
    addEventListener: jest.fn().mockName('$el.addEventListener'),
    classList: {
      add: jest.fn().mockName('$el.classList.add'),
      remove: jest.fn().mockName('$el.classList.remove'),
    },
  };
}

export const documentMock = {
  getElementById: jest
    .fn()
    .mockImplementation(newElementMock)
    .mockName('document.getElementById'),
  querySelector: jest
    .fn()
    .mockImplementation(newElementMock)
    .mockName('document.querySelector'),

  // Utility to quickly clear the entire document mock.
  __clearAllMocks: function () {
    this.querySelector.mockClear();
    this.getElementById.mockClear();
  },
};
