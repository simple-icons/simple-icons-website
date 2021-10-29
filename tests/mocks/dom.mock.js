const PATHNAME = 'https://www.simpleicons.org/';

export const document = {
  getElementById: jest.fn().mockName('document.getElementById'),
  location: {
    pathname: PATHNAME,
    search: '',
    href: PATHNAME,
  },
  querySelector: jest.fn().mockName('document.querySelector'),
  querySelectorAll: jest.fn().mockName('document.querySelectorAll'),

  // Common elements
  $body: newElementMock('body'),

  // Utility to quickly clear the entire document mock.
  __resetAllMocks: function () {
    this.getElementById.mockReset();
    this.getElementById.mockImplementation(newElementMock);
    this.location.pathname = PATHNAME;
    this.location.search = '';
    this.location.href = PATHNAME;
    this.querySelector.mockReset();
    this.querySelector.mockImplementation((query) => {
      if (query === 'body') {
        return this.$body;
      }

      return newElementMock(query);
    });
    this.querySelectorAll.mockReset();
    this.querySelectorAll.mockReturnValue([]);
    this.$body = newElementMock('body');
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
    focus: jest.fn().mockName(`${elName}.focus`),
    getAttribute: jest.fn().mockName(`${elName}.getAttribute`),
    querySelector: jest.fn().mockName(`${elName}.querySelector`),
    removeAttribute: jest.fn().mockName(`${elName}.removeAttribute`),
    setAttribute: jest.fn().mockName(`${elName}.setAttribute`),

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

export const window = {
  atob: (base64Str) => Buffer.from(base64Str, 'base64').toString('utf8'),
};
