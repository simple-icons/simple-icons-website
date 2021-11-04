const {
  document,
  newElementMock,
  newEventMock,
} = require('./mocks/dom.mock.js');
const { domUtils } = require('./mocks/dom-utils.mock.js');

const initModal = require('../public/scripts/modal.js').default;

describe('Extensions modal', () => {
  let eventListeners = new Map();

  beforeEach(() => {
    document.__resetAllMocks();
    domUtils.__resetAllMocks();
    eventListeners = new Map();
  });

  it('clicks the menu button for 3rd party extensions', () => {
    const $menuButton = newElementMock('.popup-trigger');
    $menuButton.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    document.querySelector.mockImplementation((query) =>
      query === '.popup-trigger' ? $menuButton : newElementMock(query),
    );

    initModal(document, domUtils);

    const clickListener = eventListeners.get('click');
    const event = newEventMock();
    clickListener(event);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(domUtils.toggleVisibleElement).toHaveBeenCalledTimes(1);
  });

  it("pressed 'Escape' to close the extension modal", () => {
    document.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    initModal(document, domUtils);

    const clickListener = eventListeners.get('keyup');
    const event = newEventMock({ key: 'Escape' });
    clickListener(event);
    expect(domUtils.hideElement).toHaveBeenCalledTimes(1);
  });

  it('click outside the extensions modal to close it', () => {
    document.body.addEventListener.mockImplementation((name, fn) => {
      eventListeners.set(name, fn);
    });

    initModal(document, domUtils);

    eventListeners.get('click')(newEventMock({ path: [] }));
    expect(domUtils.hideElement).toHaveBeenCalledTimes(1);
  });
});
