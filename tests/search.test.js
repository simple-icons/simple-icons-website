const { domUtils } = require('./mocks/dom-utils.mock.js');
const {
  document,
  newElementMock,
  newEventMock,
} = require('./mocks/dom.mock.js');
const { history } = require('./mocks/history.mock.js');
const { ordering } = require('./mocks/ordering.mock.js');

const { ORDER_BY_RELEVANCE } = require('../public/scripts/ordering.js');
const initSearch = require('../public/scripts/search.js').default;

describe('Search', () => {
  const inputEventListeners = new Map();
  const clearEventListeners = new Map();

  let $searchInput;
  let $searchClear;
  let $adSpace;
  let $orderByRelevance;

  beforeEach(() => {
    domUtils.__resetAllMocks();
    document.__resetAllMocks();
    history.__resetAllMocks();
    ordering.__resetAllMocks();
  });

  beforeEach(() => {
    $searchInput = newElementMock('#search-input');
    $searchInput.value = '';
    $searchInput.addEventListener.mockImplementation((name, fn) => {
      inputEventListeners.set(name, fn);
    });

    $searchClear = newElementMock('#search-clear');
    $searchClear.addEventListener.mockImplementation((name, fn) => {
      clearEventListeners.set(name, fn);
    });

    $orderByRelevance = newElementMock('#order-relevance');

    document.getElementById.mockImplementation((query) => {
      switch (query) {
        case 'search-input':
          return $searchInput;
        case 'search-clear':
          return $searchClear;
        case 'order-relevance':
          return $orderByRelevance;
        default:
          return newElementMock(query);
      }
    });

    initSearch(history, document, ordering, domUtils);
  });

  it('gets all elements of interest', () => {
    expect(document.getElementById).toHaveBeenCalledWith('search-input');
    expect(document.getElementById).toHaveBeenCalledWith('search-clear');
    expect(document.getElementById).toHaveBeenCalledWith('order-relevance');
    expect($searchInput.disabled).toBe(false);
    expect($searchInput.focus).toHaveBeenCalledTimes(1);
  });

  describe('Searching', () => {
    it('works if a value is searched for', (done) => {
      const searchValue = 'foobar';

      expect($searchInput.addEventListener).toHaveBeenCalledWith(
        'input',
        expect.any(Function),
      );

      const inputListener = inputEventListeners.get('input');
      const event = newEventMock();

      $searchInput.value = searchValue;
      inputListener(event);

      setTimeout(() => {
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(ordering.selectOrdering).toHaveBeenCalledWith(
          ORDER_BY_RELEVANCE,
        );
        expect(history.replaceState).toHaveBeenCalledWith(
          null,
          '',
          expect.stringMatching(
            `${document.location.pathname}?.*=${searchValue}$`,
          ),
        );

        expect(domUtils.showElement).toHaveBeenCalledWith($searchClear);
        expect(domUtils.showElement).toHaveBeenCalledWith($orderByRelevance);

        done();
      }, 500);
    });

    it('works if the search input is emptied', (done) => {
      ordering.currentOrderingIs.mockReturnValue(true);

      expect($searchInput.addEventListener).toHaveBeenCalledWith(
        'input',
        expect.any(Function),
      );

      const inputListener = inputEventListeners.get('input');
      const event = newEventMock();

      $searchInput.value = '';
      inputListener(event);

      setTimeout(() => {
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(ordering.resetOrdering).toHaveBeenCalledTimes(1);
        expect(history.replaceState).toHaveBeenCalledWith(
          null,
          '',
          document.location.pathname,
        );

        expect(domUtils.hideElement).toHaveBeenCalledWith($searchClear);
        expect(domUtils.hideElement).toHaveBeenCalledWith($orderByRelevance);

        done();
      }, 500);
    });

    it('works if the clear search button is clicked', (done) => {
      ordering.currentOrderingIs.mockReturnValue(true);

      expect($searchClear.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );

      const clickListener = clearEventListeners.get('click');
      const event = newEventMock();

      $searchInput.value = 'Hello world!';
      clickListener(event);

      setTimeout(() => {
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(ordering.resetOrdering).toHaveBeenCalledTimes(1);
        expect(history.replaceState).toHaveBeenCalledWith(
          null,
          '',
          document.location.pathname,
        );

        expect(domUtils.hideElement).toHaveBeenCalledWith($searchClear);
        expect(domUtils.hideElement).toHaveBeenCalledWith($orderByRelevance);

        done();
      }, 500);
    });
  });

  describe('URL query', () => {
    it('has no search query in the URL', () => {
      document.location.search = '';

      initSearch(history, document, ordering, domUtils);

      expect($searchInput.value).toEqual('');
      expect(domUtils.showElement).not.toHaveBeenCalled();
      expect(domUtils.hideElement).not.toHaveBeenCalled();
      expect(history.replaceState).not.toHaveBeenCalled();
      expect(ordering.selectOrdering).not.toHaveBeenCalled();
      expect(ordering.currentOrderingIs).not.toHaveBeenCalled();
      expect(ordering.resetOrdering).not.toHaveBeenCalled();
    });

    it.each([
      ['foobar', 'foobar'],
      ['foo%3Dbar', 'foo=bar'],
    ])('initialized based on a search query in the URL', (query, expected) => {
      document.location.search = `?q=${query}`;

      initSearch(history, document, ordering, domUtils);

      expect($searchInput.value).toEqual(expected);
      expect(domUtils.showElement).toHaveBeenCalled();
      expect(history.replaceState).toHaveBeenCalled();
      expect(ordering.selectOrdering).toHaveBeenCalled();
    });
  });
});
