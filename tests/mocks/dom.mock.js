function newElementsMocks(elName) {
  return [newElementMock(`${elName}-0`), newElementMock(`${elName}-1`)];
}

export const document = {
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
    .mockImplementation(newElementsMocks)
    .mockName('document.querySelectorAll'),

  // Utility to quickly clear the entire document mock.
  __resetAllMocks: function () {
    this.getElementById.mockClear();
    this.getElementById.mockImplementation(newElementMock);
    this.querySelector.mockClear();
    this.querySelector.mockImplementation(newElementMock);
    this.querySelectorAll.mockClear();
    this.querySelectorAll.mockImplementation(newElementsMocks);
  },
};

export function newElementMock(elName) {
  return {
    addEventListener: jest.fn().mockName(`${elName}.addEventListener`),
    blur: jest.fn().mockName(`${elName}.blur`),
    classList: {
      add: jest.fn().mockName(`${elName}.classList.add`),
      remove: jest.fn().mockName(`${elName}.classList.remove`),
    },
    removeAttribute: jest.fn().mockName(`${elName}.removeAttribute`),
  };
}

export function newEventMock() {
  return {
    preventDefault: jest.fn().mockName('event.preventDefault'),
  };
}
