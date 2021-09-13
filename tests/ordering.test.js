const {
  document,
  newElementMock,
  newEventMock,
} = require('./mocks/dom.mock.js');
const { localStorage } = require('./mocks/local-storage.mock.js');
const sortByColors = require('../scripts/color-sorting.js');
const initOrdering = require('../public/scripts/ordering.js').default;
const { STORAGE_KEY_ORDERING } = require('../public/scripts/storage.js');

describe('Ordering', () => {
  beforeEach(() => {
    document.__resetAllMocks();
    localStorage.__resetAllMocks();
  });

  it('gets the #order-alpha button', () => {
    localStorage.__setStoredValueFor(STORAGE_KEY_ORDERING, 'unknown');

    const eventListeners = new Map();

    const $orderAlphabetically = newElementMock('#order-alpha');
    $orderAlphabetically.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'order-alpha') {
        return $orderAlphabetically;
      }

      return newElementMock(query);
    });

    initOrdering(document, localStorage);
    expect(document.getElementById).toHaveBeenCalledWith('order-alpha');
    expect($orderAlphabetically.disabled).toBe(false);
    expect($orderAlphabetically.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    localStorage.setItem.mockClear();

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect($orderAlphabetically.blur).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_ORDERING,
      'alphabetically',
    );
  });

  it('gets the #order-color button', () => {
    localStorage.__setStoredValueFor(STORAGE_KEY_ORDERING, 'unknown');

    const eventListeners = new Map();

    const $orderByColor = newElementMock('#order-color');
    $orderByColor.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'order-color') {
        return $orderByColor;
      }

      return newElementMock(query);
    });

    initOrdering(document, localStorage);
    expect(document.getElementById).toHaveBeenCalledWith('order-color');
    expect($orderByColor.disabled).toBe(false);
    expect($orderByColor.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    localStorage.setItem.mockClear();

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect($orderByColor.blur).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_ORDERING,
      'color',
    );
  });

  it('gets the #order-relevance button', () => {
    const eventListeners = new Map();

    const $orderByRelevance = newElementMock('#order-relevance');
    $orderByRelevance.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'order-relevance') {
        return $orderByRelevance;
      }

      return newElementMock(query);
    });

    initOrdering(document, localStorage);
    expect(document.getElementById).toHaveBeenCalledWith('order-relevance');
    expect($orderByRelevance.disabled).toBe(false);
    expect($orderByRelevance.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect($orderByRelevance.blur).toHaveBeenCalledTimes(1);
  });

  it('uses alphabetical ordering if no value is stored', () => {
    initOrdering(document, localStorage);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(localStorage.getItem).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('uses the stored value "alphabetically"', () => {
    const storedValue = 'alphabetically';
    localStorage.__setStoredValueFor(STORAGE_KEY_ORDERING, storedValue);

    initOrdering(document, localStorage);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('uses the stored value "color"', () => {
    const storedValue = 'color';
    localStorage.__setStoredValueFor(STORAGE_KEY_ORDERING, storedValue);

    initOrdering(document, localStorage);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_ORDERING);
    expect(document.$body.classList.add).toHaveBeenCalledWith('order-by-color');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_ORDERING,
      storedValue,
    );
  });

  // issue: https://github.com/simple-icons/simple-icons-website/issues/66
  it('does not have a black-like color at the start', async () => {
    const colors = [
      '181717',
      '1D1717',
      '000000',
      '512BD4',
      '40AEF0',
      '0094F5',
      'FF0000',
      '004088',
      '0099E5',
      'EF2D5E',
      'FF9E0F',
      '071D49',
      '00A98F',
      '191A1B',
      '41454A',
      'A100FF',
      '26689A',
      'A9225C',
      '83B81A',
      '0085CA',
      '0B2C4A',
    ];

    const hexes = sortByColors(colors);
    console.log(hexes);
    // should not match black colors
    await expect(hexes[0]).not.toMatch('181717');
    await expect(hexes[1]).not.toMatch('1D1717');

    await expect(hexes[hexes.length - 1]).toMatch('000000');
  });
});
