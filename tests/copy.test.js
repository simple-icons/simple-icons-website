const { documentMock } = require('./mocks/dom.mock.js');
const { navigatorMock } = require('./mocks/navigator.mock.js');

const initCopyButtons = require('../public/scripts/copy.js').default;

describe('DOM', () => {
  beforeEach(() => documentMock.__clearAllMocks());

  it('gets elements from the DOM by id', () => {
    initCopyButtons(documentMock, navigatorMock);
    expect(documentMock.getElementById).toHaveBeenCalled();
  });

  it('gets elements from the DOM by CSS selector', () => {
    initCopyButtons(documentMock, navigatorMock);
    expect(documentMock.querySelectorAll).toHaveBeenCalled();
  });
});

describe('navigator', () => {
  beforeEach(() => navigatorMock.__clearAllMocks());

  it.todo('does something...');
});
