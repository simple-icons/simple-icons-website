const {
  document,
  newElementMock,
  newEventMock,
  window,
} = require('./mocks/dom.mock.js');
const { navigator } = require('./mocks/navigator.mock.js');

const initCopyButtons = require('../public/scripts/copy.js').default;

describe('Copy', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    document.__resetAllMocks();
    navigator.__resetAllMocks();
  });

  it('gets the #copy-input button', () => {
    initCopyButtons(window, document, navigator);
    expect(document.getElementById).toHaveBeenCalledWith('copy-input');
  });

  it('gets grid item color buttons', () => {
    const eventListeners = new Map();
    const $colorButtons = [
      newElementMock('color button 1', { innerHTML: '#000FFF' }),
      newElementMock('color button 2', { innerHTML: '#FFF000' }),
    ];

    for (const $colorButton of $colorButtons) {
      const buttonEventListeners = new Map();
      eventListeners.set($colorButton, buttonEventListeners);
      $colorButton.addEventListener.mockImplementation((name, fn) => {
        buttonEventListeners.set(name, fn);
      });
    }

    document.querySelectorAll.mockImplementation((query) => {
      if (query === '.copy-color') {
        return $colorButtons;
      }

      return [];
    });

    initCopyButtons(window, document, navigator);
    jest.runAllTimers();

    for (const $colorButton of $colorButtons) {
      const buttonEventListeners = eventListeners.get($colorButton);

      expect($colorButton.removeAttribute).toHaveBeenCalledWith('disabled');
      expect($colorButton.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );

      const clickListener = buttonEventListeners.get('click');
      const event = newEventMock();
      clickListener(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect($colorButton.classList.add).toHaveBeenCalledWith('copied');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        $colorButton.innerHTML,
      );
    }
  });

  it('gets grid item copy SVG source buttons', () => {
    const rawSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    const base64Svg = Buffer.from(rawSvg).toString('base64');
    const eventListeners = new Map();
    const $svgButtons = [
      newElementMock('preview button 1', { parentNode: true }),
      newElementMock('preview button 2', { parentNode: true }),
    ];

    for (const $svgButton of $svgButtons) {
      const buttonEventListeners = new Map();
      eventListeners.set($svgButton, buttonEventListeners);
      $svgButton.addEventListener.mockImplementation((name, fn) => {
        buttonEventListeners.set(name, fn);
      });
    }

    document.querySelectorAll.mockImplementation((query) => {
      if (query === '.copy-svg') {
        return $svgButtons;
      }

      return [];
    });

    initCopyButtons(window, document, navigator);
    jest.runAllTimers();

    for (const $svgButton of $svgButtons) {
      const buttonEventListeners = eventListeners.get($svgButton);

      const $img = newElementMock('img');
      $img.getAttribute.mockReturnValue(
        `data:image/svg+xml;base64,${base64Svg}`,
      );
      $svgButton.querySelector.mockReturnValue($img);

      expect($svgButton.removeAttribute).toHaveBeenCalledWith('disabled');
      expect($svgButton.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );

      const clickListener = buttonEventListeners.get('click');
      const event = newEventMock();
      clickListener(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect($svgButton.classList.add).toHaveBeenCalledWith('copied');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(rawSvg);
    }
  });

  afterAll(() => {
    jest.useFakeTimers();
  });
});
