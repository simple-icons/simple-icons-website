const initColorScheme = require('../public/scripts/color-scheme.js').default;
const { STORAGE_KEY_COLOR_SCHEME } = require('../public/scripts/storage.js');

function newElementMock() {
  return {
    addEventListener: jest.fn().mockName('$el.addEventListener'),
    classList: {
      add: jest.fn().mockName('$el.classList.add'),
      remove: jest.fn().mockName('$el.classList.remove'),
    },
  };
}

const documentMock = {
  getElementById: jest
    .fn()
    .mockImplementation(newElementMock)
    .mockName('document.getElementById'),
  querySelector: jest
    .fn()
    .mockImplementation(newElementMock)
    .mockName('document.querySelector'),
  _clearAllMocks: function () {
    this.querySelector.mockClear();
    this.getElementById.mockClear();
  },
};

const localStorageMock = {
  getItem: jest.fn().mockName('localStorage.getItem'),
  setItem: jest.fn().mockName('localStorage.setItem'),
  _clearAllMocks: function () {
    this.getItem.mockClear();
    this.setItem.mockClear();
  },
};

describe('DOM', () => {
  beforeEach(() => documentMock._clearAllMocks());

  it('gets elements from the DOM by id', () => {
    initColorScheme(documentMock, localStorageMock);
    expect(documentMock.getElementById).toHaveBeenCalled();
  });

  it('gets elements from the DOM by CSS selector', () => {
    initColorScheme(documentMock, localStorageMock);
    expect(documentMock.querySelector).toHaveBeenCalled();
  });
});

describe('localStorage', () => {
  beforeEach(() => localStorageMock._clearAllMocks());

  it('checks if a value is stored for the color scheme', () => {
    initColorScheme(documentMock, localStorageMock);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
    );
  });
});
