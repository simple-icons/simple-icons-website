const {
  hideElement,
  showElement,
  toggleClass,
  addClass,
  removeClass,
} = require('../public/scripts/dom-utils.js');

const $el = {
  classList: {
    add: jest.fn().mockName('$el.classList.add'),
    remove: jest.fn().mockName('$el.classList.remove'),
    toggle: jest.fn().mockName('$el.classList.toggle'),
    add: jest.fn().mockName('$el.classList.add'),
    remove: jest.fn().mockName('$el.classList.remove'),
  },
  removeAttribute: jest.fn().mockName('$el.removeAttribute'),
  setAttribute: jest.fn().mockName('$el.setAttribute'),
};

describe('::hideElement', () => {
  beforeEach(() => {
    $el.classList.add.mockReset();
    $el.setAttribute.mockReset();
  });

  it('adds the .hidden class and the aria-hidden attribute', () => {
    hideElement($el);
    expect($el.classList.add).toHaveBeenCalledWith('hidden');
    expect($el.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');
  });
});

describe('::showElement', () => {
  beforeEach(() => {
    $el.classList.remove.mockReset();
    $el.removeAttribute.mockReset();
  });

  it('removes the .hidden class and the aria-hidden attribute', () => {
    showElement($el);
    expect($el.classList.remove).toHaveBeenCalledWith('hidden');
    expect($el.removeAttribute).toHaveBeenCalledWith('aria-hidden');
  });
});

describe('::removeClass', () => {
  beforeEach(() => {
    $el.classList.remove.mockReset();
  });

  it('removes a CSS class from an element', () => {
    removeClass($el, 'last__button');
    expect($el.classList.remove).toHaveBeenCalledWith('last__button');
  });
});

describe('::addClass', () => {
  beforeEach(() => {
    $el.classList.add.mockReset();
  });

  it('adds a CSS class to an element', () => {
    addClass($el, 'last__button');
    expect($el.classList.add).toHaveBeenCalledWith('last__button');
  });
});
