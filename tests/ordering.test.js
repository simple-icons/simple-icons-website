const {
  document,
  newElementMock,
  newEventMock,
  window,
} = require('./mocks/dom.mock.js');
const { domUtils } = require('./mocks/dom-utils.mock.js');
const { localStorage } = require('./mocks/local-storage.mock.js');

const initOrdering = require('../public/scripts/ordering.js').default;
const { STORAGE_KEY_ORDERING } = require('../public/scripts/storage.js');

describe('Ordering', () => {
  beforeEach(() => {
    document.__resetAllMocks();
    localStorage.__resetAllMocks();
    window.__resetAllMocks();
  });

  it('gets the #order-alpha button', () => {
    localStorage.__setStoredValueFor(STORAGE_KEY_ORDERING, 'unknown');

    const eventListeners = new Map();

    const $orderAlpha = newElementMock('#order-alpha');
    $orderAlpha.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'order-alpha') {
        return $orderAlpha;
      }

      return newElementMock(query);
    });

    initOrdering(window, document, localStorage, domUtils);
    expect(document.getElementById).toHaveBeenCalledWith('order-alpha');
    expect($orderAlpha.disabled).toBe(false);
    expect($orderAlpha.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    localStorage.setItem.mockClear();
    window.scrollTo.mockClear();

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_ORDERING,
      'order-alpha',
    );
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('gets the #order-color button', () => {
    localStorage.__setStoredValueFor(STORAGE_KEY_ORDERING, 'unknown');

    const eventListeners = new Map();

    const $orderColor = newElementMock('#order-color');
    $orderColor.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'order-color') {
        return $orderColor;
      }

      return newElementMock(query);
    });

    initOrdering(window, document, localStorage, domUtils);
    expect(document.getElementById).toHaveBeenCalledWith('order-color');
    expect($orderColor.disabled).toBe(false);
    expect($orderColor.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    localStorage.setItem.mockClear();

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_ORDERING,
      'order-color',
    );
  });

  it('gets the #order-relevance button', () => {
    const eventListeners = new Map();

    const $orderRelevance = newElementMock('#order-relevance');
    $orderRelevance.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'order-relevance') {
        return $orderRelevance;
      }

      return newElementMock(query);
    });

    initOrdering(window, document, localStorage, domUtils);
    expect(document.getElementById).toHaveBeenCalledWith('order-relevance');
    expect($orderRelevance.disabled).toBe(false);
    expect($orderRelevance.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('uses alphabetical ordering if no value is stored', () => {
    initOrdering(window, document, localStorage, domUtils);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(localStorage.getItem).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('uses the stored value "alpha"', () => {
    const storedValue = 'alpha';
    localStorage.__setStoredValueFor(STORAGE_KEY_ORDERING, storedValue);

    initOrdering(window, document, localStorage, domUtils);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('uses the stored value "order-color"', () => {
    const storedValue = 'order-color';
    localStorage.__setStoredValueFor(STORAGE_KEY_ORDERING, storedValue);

    initOrdering(window, document, localStorage, domUtils);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(document.$body.classList.add).toHaveBeenCalledWith('order-color');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_ORDERING,
      storedValue,
    );
  });
});
