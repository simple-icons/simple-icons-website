function newElementsMocks(elName) {
  return [newElementMock(`${elName}-0`), newElementMock(`${elName}-1`)];
}

export const document = {
  getElementById: jest.fn().mockName('document.getElementById'),
  querySelector: jest.fn().mockName('document.querySelector'),
  querySelectorAll: jest.fn().mockName('document.querySelectorAll'),

  // Common elements
  $body: newElementMock('body'),

  // Utility to quickly clear the entire document mock.
  __resetAllMocks: function () {
    this.$body = newElementMock('body');
    this.getElementById.mockClear();
    this.getElementById.mockImplementation(newElementMock);
    this.querySelector.mockClear();
    this.querySelector.mockImplementation((query) => {
      if (query === 'body') {
        return this.$body;
      }

      return newElementMock(query);
    });
    this.querySelectorAll.mockClear();
    this.querySelectorAll.mockImplementation(newElementsMocks);
  },
};

export function newElementMock(elName, opts) {
  opts = opts || {};
  return {
    addEventListener: jest.fn().mockName(`${elName}.addEventListener`),
    blur: jest.fn().mockName(`${elName}.blur`),
    classList: {
      add: jest.fn().mockName(`${elName}.classList.add`),
      remove: jest.fn().mockName(`${elName}.classList.remove`),
    },
    removeAttribute: jest.fn().mockName(`${elName}.removeAttribute`),
    querySelector: jest.fn().mockName(`${elName}.querySelector`),

    // Values
    innerHTML: opts.innerHTML || '',
    parentNode: opts.parentNode
      ? newElementMock(`${elName} parent`, { parentNode: false })
      : null,

    // Utility
    __name: elName,
  };
}

export function newEventMock() {
  return {
    preventDefault: jest.fn().mockName('event.preventDefault'),
  };
}
