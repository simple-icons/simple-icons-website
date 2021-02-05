const { document } = require('./mocks/dom.mock.js');
const { navigator } = require('./mocks/navigator.mock.js');

const initCopyButtons = require('../public/scripts/copy.js').default;

describe('DOM', () => {
  beforeEach(() => document.__resetAllMocks());

  it('gets elements from the DOM by id', () => {
    initCopyButtons(document, navigator);
    expect(document.getElementById).toHaveBeenCalled();
  });

  it('gets elements from the DOM by CSS selector', () => {
    initCopyButtons(document, navigator);
    expect(document.querySelectorAll).toHaveBeenCalled();
  });
});

describe('navigator', () => {
  beforeEach(() => navigator.__resetAllMocks());

  it.todo('does something...');
});
