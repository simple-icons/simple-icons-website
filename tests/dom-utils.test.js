const {
  hideElement,
  showElement,
  toggleVisibleElement,
  sortChildren,
} = require('../public/scripts/dom-utils.js');

const orderedData = [
  { 'order-alpha': 1, getAttribute: (order) => 1 },
  { 'order-alpha': 2, getAttribute: (order) => 2 },
  { 'order-alpha': 3, getAttribute: (order) => 3 },
];
const testData = [
  { 'order-alpha': 3, getAttribute: (order) => 3 },
  { 'order-alpha': 2, getAttribute: (order) => 2 },
  { 'order-alpha': 1, getAttribute: (order) => 1 },
];
const $el = {
  classList: {
    add: jest.fn().mockName('$el.classList.add'),
    remove: jest.fn().mockName('$el.classList.remove'),
    toggle: jest.fn().mockName('$el.classList.toggle'),
  },
  children: testData,
  appendChild: (obj) => {
    const index = testData.indexOf(obj);
    if (index > -1) {
      testData.splice(index, 1);
    }
    testData.push(obj);
  },
  removeAttribute: jest.fn().mockName('$el.removeAttribute'),
  setAttribute: jest.fn().mockName('$el.setAttribute'),
  toggleAttribute: jest.fn().mockName('$el.toggleAttribute'),
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
  beforeEach(() => {
    $el.children = testData;
  });

  it('sorts children elements', () => {
    sortChildren($el, 'order-alpha');
    expect(JSON.stringify($el.children)).toEqual(JSON.stringify(orderedData));
  });
});
