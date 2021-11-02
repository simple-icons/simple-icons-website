const {
  document,
  newElementMock,
  newEventMock,
} = require('./mocks/dom.mock.js');
const { domUtils } = require('./mocks/dom-utils.mock.js');

const initModal = require('../public/scripts/modal.js').default;

describe('Extensions modal', () => {
  beforeEach(() => {
    document.__resetAllMocks();
    domUtils.__resetAllMocks();
  });

  it('clicks the menu button for 3rd party extensions', () => {
    const eventListeners = new Map();

    const $menuButton = newElementMock('button.popup-trigger');
    $menuButton.addEventListener.mockImplementation((name, fn) => {
      console.log('++++++++++++++++++++++++++++++');
      console.log('++++++++++++++++++++++++++++++');
      console.log('++++++++++++++++++++++++++++++');
      console.log('++++++++++++++++++++++++++++++');
      eventListeners.set(name, fn);
    });

    document.getElementById.mockImplementation((query) => {
      if (query === 'button.popup-trigger') {
        return $menuButton;
      }

      return newElementMock(query);
    });

    initModal(document, domUtils);

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(domUtils.toggleVisibleElement).toHaveBeenCalledTimes(1);
  });

  it("pressed 'Escape' to close the extension modal", () => {
    const eventListeners = new Map();

    document.$body.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    initModal(document, domUtils);

    const keyListener = eventListeners.get('keyup');
    var event = newEventMock('Escape');
    keyListener(event);
    expect(domUtils.hideElement).toHaveBeenCalledTimes(1);
  });

  it('click outside the extensions modal to close it', () => {
    const eventListeners = new Map();

    document.$body.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    initModal(document, domUtils);

    const keyListener = eventListeners.get('keyup');
    var event = newEventMock('Escape');
    keyListener(event);
    expect(domUtils.hideElement).toHaveBeenCalledTimes(1);
  });
});
