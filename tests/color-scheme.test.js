const {
  document,
  newElementMock,
  newEventMock,
} = require('./mocks/dom.mock.js');
const { localStorage } = require('./mocks/local-storage.mock.js');

const initColorScheme = require('../public/scripts/color-scheme.js').default;
const { STORAGE_KEY_COLOR_SCHEME } = require('../public/scripts/storage.js');

describe('Color scheme', () => {
  let $body;

  beforeEach(() => {
    document.__resetAllMocks();
    localStorage.__resetAllMocks();

    $body = newElementMock('body');
    document.querySelector.mockImplementation((query) => {
      if (query === 'body') {
        return $body;
      }

      return newElementMock(query);
    });
  });

  it('gets the #color-scheme-dark button', () => {
    const eventListeners = new Map();

    let $colorSchemeDark = newElementMock('#color-scheme-dark');
    $colorSchemeDark.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'color-scheme-dark') {
        return $colorSchemeDark;
      }

      return newElementMock(query);
    });

    initColorScheme(document, localStorage);
    expect(document.getElementById).toHaveBeenCalledWith('color-scheme-dark');
    expect($colorSchemeDark.disabled).toBe(false);
    expect($colorSchemeDark.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

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

  it('gets the #color-scheme-light button', () => {
    const eventListeners = new Map();

    let $colorSchemeLight = newElementMock('#color-scheme-light');
    $colorSchemeLight.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'color-scheme-light') {
        return $colorSchemeLight;
      }

      return newElementMock(query);
    });

    initColorScheme(document, localStorage);
    expect(document.getElementById).toHaveBeenCalledWith('color-scheme-light');
    expect($colorSchemeLight.disabled).toBe(false);
    expect($colorSchemeLight.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

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

  it('gets the #color-scheme-system button', () => {
    const eventListeners = new Map();

    let $colorSchemeSystem = newElementMock('#color-scheme-system');
    $colorSchemeSystem.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'color-scheme-system') {
        return $colorSchemeSystem;
      }

      return newElementMock(query);
    });

    initColorScheme(document, localStorage);
    expect(document.getElementById).toHaveBeenCalledWith('color-scheme-system');
    expect($colorSchemeSystem.disabled).toBe(false);
    expect($colorSchemeSystem.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

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
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
      'system',
    );
  });

  it('uses the stored value "dark"', () => {
    const storedValue = 'dark';
    localStorage.__storedValueFor(STORAGE_KEY_COLOR_SCHEME, storedValue);

    initColorScheme(document, localStorage);
    expect($body.classList.add).toHaveBeenCalledWith('dark');
    expect($body.classList.remove).toHaveBeenCalledWith('light');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
      storedValue,
    );
  });

  it('uses the stored value "light"', () => {
    const storedValue = 'light';
    localStorage.__storedValueFor(STORAGE_KEY_COLOR_SCHEME, storedValue);

    initColorScheme(document, localStorage);
    expect($body.classList.add).toHaveBeenCalledWith('light');
    expect($body.classList.remove).toHaveBeenCalledWith('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
      storedValue,
    );
  });

  it('uses the stored value "system"', () => {
    const storedValue = 'system';
    localStorage.__storedValueFor(STORAGE_KEY_COLOR_SCHEME, storedValue);

    initColorScheme(document, localStorage);
    expect($body.classList.remove).toHaveBeenCalledWith('dark', 'light');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_COLOR_SCHEME,
      storedValue,
    );
  });
});
