const {
  document,
  newElementMock,
  newEventMock,
} = require('./mocks/dom.mock.js');
const { localStorage } = require('./mocks/local-storage.mock.js');

const initColorScheme = require('../public/scripts/color-scheme.js').default;
const { STORAGE_KEY_COLOR_SCHEME } = require('../public/scripts/storage.js');

describe('Color scheme', () => {
  beforeEach(() => {
    document.__resetAllMocks();
    localStorage.__resetAllMocks();
  });

  it('gets the #id-color-scheme-dark button', () => {
    localStorage.__setStoredValueFor(STORAGE_KEY_COLOR_SCHEME, 'unknown');

    const eventListeners = new Map();

    const $colorSchemeDark = newElementMock('#id-color-scheme-dark');
    $colorSchemeDark.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'id-color-scheme-dark') {
        return $colorSchemeDark;
      }

      return newElementMock(query);
    });

    initColorScheme(document, localStorage);
    expect(document.getElementById).toHaveBeenCalledWith(
      'id-color-scheme-dark',
    );
    expect($colorSchemeDark.disabled).toBe(false);
    expect($colorSchemeDark.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    localStorage.setItem.mockClear();

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect($colorSchemeDark.blur).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
      'dark',
    );
  });

  it('gets the #id-color-scheme-light button', () => {
    localStorage.__setStoredValueFor(STORAGE_KEY_COLOR_SCHEME, 'unknown');

    const eventListeners = new Map();

    const $colorSchemeLight = newElementMock('#id-color-scheme-light');
    $colorSchemeLight.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'id-color-scheme-light') {
        return $colorSchemeLight;
      }

      return newElementMock(query);
    });

    initColorScheme(document, localStorage);
    expect(document.getElementById).toHaveBeenCalledWith(
      'id-color-scheme-light',
    );
    expect($colorSchemeLight.disabled).toBe(false);
    expect($colorSchemeLight.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    localStorage.setItem.mockClear();

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect($colorSchemeLight.blur).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
      'light',
    );
  });

  it('gets the #id-color-scheme-system button', () => {
    localStorage.__setStoredValueFor(STORAGE_KEY_COLOR_SCHEME, 'unknown');

    const eventListeners = new Map();

    const $colorSchemeSystem = newElementMock('#id-color-scheme-system');
    $colorSchemeSystem.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'id-color-scheme-system') {
        return $colorSchemeSystem;
      }

      return newElementMock(query);
    });

    initColorScheme(document, localStorage);
    expect(document.getElementById).toHaveBeenCalledWith(
      'id-color-scheme-system',
    );
    expect($colorSchemeSystem.disabled).toBe(false);
    expect($colorSchemeSystem.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    localStorage.setItem.mockClear();

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect($colorSchemeSystem.blur).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
      'system',
    );
  });

  it('uses the system color scheme if no value is stored', () => {
    initColorScheme(document, localStorage);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_COLOR_SCHEME);
    expect(localStorage.getItem).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('uses the stored value "dark"', () => {
    const storedValue = 'dark';
    localStorage.__setStoredValueFor(STORAGE_KEY_COLOR_SCHEME, storedValue);

    initColorScheme(document, localStorage);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_COLOR_SCHEME);
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_COLOR_SCHEME);
    expect(document.$body.classList.add).toHaveBeenCalledWith('dark-mode');
    expect(document.$body.classList.remove).toHaveBeenCalledWith('light-mode');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
      storedValue,
    );
  });

  it('uses the stored value "light"', () => {
    const storedValue = 'light';
    localStorage.__setStoredValueFor(STORAGE_KEY_COLOR_SCHEME, storedValue);

    initColorScheme(document, localStorage);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_COLOR_SCHEME);
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_COLOR_SCHEME);
    expect(document.$body.classList.add).toHaveBeenCalledWith('light-mode');
    expect(document.$body.classList.remove).toHaveBeenCalledWith('dark-mode');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
      storedValue,
    );
  });

  it('uses the stored value "system"', () => {
    const storedValue = 'system';
    localStorage.__setStoredValueFor(STORAGE_KEY_COLOR_SCHEME, storedValue);

    initColorScheme(document, localStorage);
    expect(localStorage.hasItem).toHaveBeenCalledWith(STORAGE_KEY_COLOR_SCHEME);
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_COLOR_SCHEME);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
