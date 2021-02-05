export function newElementMock(elName) {
  return {
    addEventListener: jest.fn().mockName(`${elName}.addEventListener`),
    classList: {
      add: jest.fn().mockName(`${elName}.classList.add`),
      remove: jest.fn().mockName(`${elName}.classList.remove`),
    },
    removeAttribute: jest.fn().mockName(`${elName}.removeAttribute`),
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
  querySelectorAll: jest
    .fn()
    .mockImplementation((elName) => {
      return [newElementMock(`${elName}-0`), newElementMock(`${elName}-0`)];
    })
    .mockName('document.querySelectorAll'),

  // Utility to quickly clear the entire document mock.
  __clearAllMocks: function () {
    this.querySelector.mockClear();
    this.getElementById.mockClear();
    this.querySelectorAll.mockClear();
  },
};
