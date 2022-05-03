import {
  document,
  newElementMock,
  newEventMock,
  window,
} from './mocks/dom.mock.js';
import domUtils from './mocks/dom-utils.mock.js';
import localStorage from './mocks/local-storage.mock.js';

import initOrdering from '../public/scripts/ordering.js';
import { STORAGE_KEY_ORDERING } from '../public/scripts/storage.js';

describe('Ordering', () => {
  beforeEach(() => {
    document.__resetAllMocks();
    localStorage.__resetAllMocks();
    window.__resetAllMocks();
    domUtils.__resetAllMocks();
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
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_ORDERING,
      'order-color',
    );
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
