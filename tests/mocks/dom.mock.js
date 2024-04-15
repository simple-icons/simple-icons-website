import {jest} from '@jest/globals';

const PATHNAME = 'https://www.simpleicons.org';

export const newElementMock = (elementName, options) => {
  options ||= {};
  return {
    addEventListener: jest.fn().mockName(`${elementName}.addEventListener`),
    blur: jest.fn().mockName(`${elementName}.blur`),
    classList: {
      add: jest.fn().mockName(`${elementName}.classList.add`),
      remove: jest.fn().mockName(`${elementName}.classList.remove`),
      replace: jest.fn().mockName(`${elementName}.classList.replace`),
    },
    focus: jest.fn().mockName(`${elementName}.focus`),
    getAttribute: jest.fn().mockName(`${elementName}.getAttribute`),
    querySelector: jest.fn().mockName(`${elementName}.querySelector`),
    removeAttribute: jest.fn().mockName(`${elementName}.removeAttribute`),
    setAttribute: jest.fn().mockName(`${elementName}.setAttribute`),
    children: [],

    // Values
    innerHTML: options.innerHTML || '',
    parentNode: options.parentNode
      ? newElementMock(`${elementName} parent`, {parentNode: false})
      : null,

    // Utility
    __name: elementName,
  };
};

export const newEventMock = (options) => {
  options ||= {};
  return {
    preventDefault: jest.fn().mockName('event.preventDefault'),
    stopPropagation: jest.fn().mockName('event.stopPropagation'),
    key: options.key || '',
    composedPath: options.composedPath ?? (() => ''),
    target: options.target || newElementMock('event.target'),
  };
};

export const document = {
  getElementById: jest.fn().mockName('document.getElementById'),
  addEventListener: jest.fn().mockName('document.addEventListener'),
  location: {
    pathname: PATHNAME,
    search: '',
  },
  querySelector: jest.fn().mockName('document.querySelector'),
  querySelectorAll: jest.fn().mockName('document.querySelectorAll'),

  // Common elements
  body: newElementMock('body'),

  // Utility to quickly clear the entire document mock.
  __resetAllMocks() {
    this.getElementById.mockReset();
    this.getElementById.mockImplementation(newElementMock);
    this.location.pathname = PATHNAME;
    this.location.search = '';
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

export const window = {
  scrollTo: jest.fn().mockName('window.scrollTo'),
  __resetAllMocks() {
    this.scrollTo.mockReset();
  },
};
