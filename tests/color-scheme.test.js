const { documentMock } = require('./mocks/dom.mock.js');
const { localStorageMock } = require('./mocks/local-storage.mock.js');

const initColorScheme = require('../public/scripts/color-scheme.js').default;
const { STORAGE_KEY_COLOR_SCHEME } = require('../public/scripts/storage.js');

describe('DOM', () => {
  beforeEach(() => documentMock.__clearAllMocks());

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
  beforeEach(() => localStorageMock.__clearAllMocks());

  it('checks if a value is stored for the color scheme', () => {
    initColorScheme(documentMock, localStorageMock);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
    );
  });
});
