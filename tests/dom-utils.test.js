const {
  hideElement,
  showElement,
  toggleVisibleElement,
  sortChildren,
} = require('../public/scripts/dom-utils.js');

const $el = {
  classList: {
    add: jest.fn().mockName('$el.classList.add'),
    remove: jest.fn().mockName('$el.classList.remove'),
    toggle: jest.fn().mockName('$el.classList.toggle'),
  },
  children: [],
  appendChild: (obj) => {
    $el.children.push(obj);
  },
  removeAttribute: jest.fn().mockName('$el.removeAttribute'),
  setAttribute: jest.fn().mockName('$el.setAttribute'),
  toggleAttribute: jest.fn().mockName('$el.toggleAttribute'),
};

Object.defineProperty($el, 'innerHTML', {
  set: jest.fn(() => {
    $el.children = [];
  }),
});

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

describe('::toggleVisibleElement', () => {
  beforeEach(() => {
    $el.classList.toggle.mockReset();
    $el.toggleAttribute.mockReset();
  });

  it('toggles the .hidden class', () => {
    toggleVisibleElement($el);
    expect($el.classList.toggle).toHaveBeenCalledWith('hidden');
  });

  it('toggles the aria-hidden attribute', () => {
    toggleVisibleElement($el);
    expect($el.toggleAttribute).toHaveBeenCalledWith('aria-hidden');
  });
});

describe('::toggleVisibleElement', () => {
  beforeEach(() => {
    $el.classList.toggle.mockReset();
    $el.toggleAttribute.mockReset();
  });

  it('toggles the .hidden class', () => {
    toggleVisibleElement($el);
    expect($el.classList.toggle).toHaveBeenCalledWith('hidden');
  });

  it('toggles the aria-hidden attribute', () => {
    toggleVisibleElement($el);
    expect($el.toggleAttribute).toHaveBeenCalledWith('aria-hidden');
  });
});

describe('::sortChildren', () => {
  it('sorts children elements', () => {
    $el.children = [
      { 'order-alpha': 2, getAttribute: () => 2 },
      { 'order-alpha': 3, getAttribute: () => 3 },
      { 'order-alpha': 1, getAttribute: () => 1 },
    ];

    const expectedOrder = [
      { 'order-alpha': 1, getAttribute: () => 1 },
      { 'order-alpha': 2, getAttribute: () => 2 },
      { 'order-alpha': 3, getAttribute: () => 3 },
    ];

    sortChildren($el, 'order-alpha');
    expect(JSON.stringify($el.children)).toEqual(JSON.stringify(expectedOrder));
  });
});
