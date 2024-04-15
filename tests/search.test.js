import {jest} from '@jest/globals';
import {ORDER_RELEVANCE} from '../public/scripts/ordering.js';
import initSearch from '../public/scripts/search.js';
import domUtils from './mocks/dom-utils.mock.js';
import {document, newElementMock, newEventMock} from './mocks/dom.mock.js';
import history from './mocks/history.mock.js';
import localStorage from './mocks/local-storage.mock.js';
import ordering from './mocks/ordering.mock.js';

describe('Search', () => {
  const inputEventListeners = new Map();
  const clearEventListeners = new Map();

  let $searchInput;
  let $searchClear;
  let $orderRelevance;
  let $orderByColor;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    domUtils.__resetAllMocks();
    document.__resetAllMocks();
    history.__resetAllMocks();
    ordering.__resetAllMocks();
  });

  beforeEach(() => {
    $searchInput = newElementMock('#search-input');
    $searchInput.value = '';
    $searchInput.addEventListener.mockImplementation((name, function_) => {
      inputEventListeners.set(name, function_);
    });

    $searchClear = newElementMock('#search-clear');
    $searchClear.addEventListener.mockImplementation((name, function_) => {
      clearEventListeners.set(name, function_);
    });

    $orderRelevance = newElementMock('#order-relevance');
    $orderByColor = newElementMock('#order-color');

    document.querySelector.mockImplementation((query) => {
      switch (query) {
        case '#search-input': {
          return $searchInput;
        }

        case '#search-clear': {
          return $searchClear;
        }

        case '#order-relevance': {
          return $orderRelevance;
        }

        case '#order-color': {
          return $orderByColor;
        }

        default: {
          return newElementMock(query);
        }
      }
    });

    initSearch(history, document, ordering, domUtils);
  });

  it('gets all elements of interest', () => {
    expect(document.querySelector).toHaveBeenCalledWith('#search-input');
    expect(document.querySelector).toHaveBeenCalledWith('#search-clear');
    expect(document.querySelector).toHaveBeenCalledWith('#order-relevance');
    expect($searchInput.disabled).toBe(false);
    expect($searchInput.focus).toHaveBeenCalledTimes(1);
  });

  it('gets the #order-relevance button', () => {
    const eventListeners = new Map();

    $orderRelevance.addEventListener.mockImplementation((name, function_) => {
      eventListeners.set(name, function_);
    });

    initSearch(history, document, ordering, domUtils);
    expect(document.querySelector).toHaveBeenCalledWith('#order-relevance');
    expect($orderRelevance.disabled).toBe(false);
    expect($orderRelevance.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  describe('Searching', () => {
    it('works if a value is searched for', (done) => {
      const searchValue = 'foobar';
      $searchInput.value = searchValue;
      const inputListener = inputEventListeners.get('input');
      const event = newEventMock();
      inputListener(event);

      expect($searchInput.addEventListener).toHaveBeenCalledWith(
        'input',
        expect.any(Function),
      );

      jest.runAllTimers();

      expect(ordering.selectOrdering).toHaveBeenCalledWith(ORDER_RELEVANCE, []);
      expect(history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringMatching(
          `${document.location.pathname}?.*=${searchValue}$`,
        ),
      );

      expect(domUtils.showElement).toHaveBeenCalledWith($searchClear);
      expect(domUtils.showElement).toHaveBeenCalledWith($orderRelevance);

      done();
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
      jest.runAllTimers();

      expect(ordering.resetOrdering).toHaveBeenCalledTimes(1);
      expect(history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        document.location.pathname,
      );

      expect(domUtils.hideElement).toHaveBeenCalledWith($searchClear);
      expect(domUtils.hideElement).toHaveBeenCalledWith($orderRelevance);
      done();
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
      jest.runAllTimers();

      expect(ordering.resetOrdering).toHaveBeenCalledTimes(1);
      expect(history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        document.location.pathname,
      );

      expect(domUtils.hideElement).toHaveBeenCalledWith($searchClear);
      expect(domUtils.hideElement).toHaveBeenCalledWith($orderRelevance);
      done();
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

  afterAll(() => {
    jest.useFakeTimers();
  });
});
