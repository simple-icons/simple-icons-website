const { document } = require('./mocks/dom.mock.js');

const initSearch = require('../public/scripts/search.js').default;

describe('Search', () => {
  beforeEach(() => {
    document.__resetAllMocks();
  });

  it.todo('does something');
});
