const {
  document,
  newElementMock,
  newEventMock,
} = require('./mocks/dom.mock.js');
const { navigator } = require('./mocks/navigator.mock.js');

const initCopyButtons = require('../public/scripts/copy.js').default;

describe('Copy', () => {
  beforeEach(() => {
    document.__resetAllMocks();
    navigator.__resetAllMocks();
  });

  it('gets the #copy-input button', () => {
    initCopyButtons(document, navigator);
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

    initCopyButtons(document, navigator);
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
      expect($colorButton.blur).toHaveBeenCalledTimes(1);
      expect($colorButton.classList.add).toHaveBeenCalledWith('copied');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        $colorButton.innerHTML,
      );
    }
  });

  it('gets grid item copy SVG source buttons', () => {
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

    initCopyButtons(document, navigator);
    for (const $svgButton of $svgButtons) {
      const buttonEventListeners = eventListeners.get($svgButton);

      const $svg = newElementMock('svg');
      $svg.outerHTML = `<svg>${$svgButton.__name}</svg>`;

      const $parent = $svgButton.parentNode;
      $parent.querySelector.mockReturnValue($svg);

      expect($svgButton.removeAttribute).toHaveBeenCalledWith('disabled');
      expect($svgButton.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );

      const clickListener = buttonEventListeners.get('click');
      const event = newEventMock();
      clickListener(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect($svgButton.blur).toHaveBeenCalledTimes(1);
      expect($svgButton.classList.add).toHaveBeenCalledWith('copied');
      expect($parent.querySelector).toHaveBeenCalledWith('svg');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        $svg.outerHTML,
      );
    }
  });
});
