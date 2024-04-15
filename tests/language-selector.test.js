import initLanguageSelector from '../public/scripts/language-selector';
import domUtils from './mocks/dom-utils.mock.js';
import {document, newElementMock, newEventMock} from './mocks/dom.mock.js';

describe('Language selector', () => {
  let eventListeners = new Map();

  beforeEach(() => {
    document.__resetAllMocks();
    domUtils.__resetAllMocks();
    eventListeners = new Map();
  });

  it('clicks the menu button for language selector', () => {
    const $languageSelectorButton = newElementMock('#language-selector');
    $languageSelectorButton.addEventListener.mockImplementation(
      (name, function_) => {
        eventListeners.set(name, function_);
      },
    );

    document.querySelector.mockImplementation((query) =>
      query === '#language-selector'
        ? $languageSelectorButton
        : newElementMock(query),
    );

    initLanguageSelector(document, domUtils);

    const event = newEventMock();
    eventListeners.get('click')(event);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(domUtils.toggleVisibleElement).toHaveBeenCalledTimes(1);
  });

  it.each([['clicking outside', 'click', {composedPath: () => []}]])(
    'closes the language selector by %s',
    (message, event, eventParameter) => {
      document.addEventListener.mockImplementation((name, function_) => {
        eventListeners.set(name, function_);
      });

      initLanguageSelector(document, domUtils);

      eventListeners.get(event)(newEventMock(eventParameter));
      expect(domUtils.hideElement).toHaveBeenCalledTimes(1);
    },
  );
});
