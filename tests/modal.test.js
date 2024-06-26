import initModal from '../public/scripts/modal.js';
import domUtils from './mocks/dom-utils.mock.js';
import {document, newElementMock, newEventMock} from './mocks/dom.mock.js';

describe('Extensions modal', () => {
  let eventListeners = new Map();

  beforeEach(() => {
    document.__resetAllMocks();
    domUtils.__resetAllMocks();
    eventListeners = new Map();
  });

  it('clicks the menu button for 3rd party extensions', () => {
    const $menuButton = newElementMock('.popup-trigger');
    $menuButton.addEventListener.mockImplementation((name, function_) => {
      eventListeners.set(name, function_);
    });

    document.querySelector.mockImplementation((query) =>
      query === '.popup-trigger' ? $menuButton : newElementMock(query),
    );

    initModal(document, domUtils);

    const event = newEventMock();
    eventListeners.get('click')(event);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(domUtils.toggleVisibleElement).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["pressing 'Escape'", 'keyup', {key: 'Escape'}],
    ['clicking outside the modal', 'click', {composedPath: () => []}],
  ])('closes the extensions modal by %s', (message, event, eventParameter) => {
    document.addEventListener.mockImplementation((name, function_) => {
      eventListeners.set(name, function_);
    });

    initModal(document, domUtils);

    eventListeners.get(event)(newEventMock(eventParameter));
    expect(domUtils.hideElement).toHaveBeenCalledTimes(2);
  });
});
