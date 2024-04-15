/* eslint accessor-pairs: ["error", {"setWithoutGet": false}] */
import {jest} from '@jest/globals';
import {
  hideElement,
  replaceChildren,
  showElement,
  sortChildren,
  toggleVisibleElement,
} from '../public/scripts/dom-utils.js';

const $element = {
  classList: {
    add: jest.fn().mockName('$el.classList.add'),
    remove: jest.fn().mockName('$el.classList.remove'),
    toggle: jest.fn().mockName('$el.classList.toggle'),
  },
  children: [],
  append(object) {
    $element.children.push(object);
  },
  removeAttribute: jest.fn().mockName('$el.removeAttribute'),
  setAttribute: jest.fn().mockName('$el.setAttribute'),
  toggleAttribute: jest.fn().mockName('$el.toggleAttribute'),
};

Object.defineProperty($element, 'innerHTML', {
  set: jest.fn(() => {
    $element.children = [];
  }),
});

describe('::hideElement', () => {
  beforeEach(() => {
    $element.classList.add.mockReset();
    $element.setAttribute.mockReset();
  });

  it('adds the .hidden class and the aria-hidden attribute', () => {
    hideElement($element);
    expect($element.classList.add).toHaveBeenCalledWith('hidden');
    expect($element.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');
  });
});

describe('::showElement', () => {
  beforeEach(() => {
    $element.classList.remove.mockReset();
    $element.removeAttribute.mockReset();
  });

  it('removes the .hidden class and the aria-hidden attribute', () => {
    showElement($element);
    expect($element.classList.remove).toHaveBeenCalledWith('hidden');
    expect($element.removeAttribute).toHaveBeenCalledWith('aria-hidden');
  });
});

describe('::toggleVisibleElement', () => {
  beforeEach(() => {
    $element.classList.toggle.mockReset();
    $element.toggleAttribute.mockReset();
  });

  it('toggles the .hidden class', () => {
    toggleVisibleElement($element);
    expect($element.classList.toggle).toHaveBeenCalledWith('hidden');
  });

  it('toggles the aria-hidden attribute', () => {
    toggleVisibleElement($element);
    expect($element.toggleAttribute).toHaveBeenCalledWith('aria-hidden');
  });
});

describe('::toggleVisibleElement', () => {
  beforeEach(() => {
    $element.classList.toggle.mockReset();
    $element.toggleAttribute.mockReset();
  });

  it('toggles the .hidden class', () => {
    toggleVisibleElement($element);
    expect($element.classList.toggle).toHaveBeenCalledWith('hidden');
  });

  it('toggles the aria-hidden attribute', () => {
    toggleVisibleElement($element);
    expect($element.toggleAttribute).toHaveBeenCalledWith('aria-hidden');
  });
});

describe('::sortChildren', () => {
  it('sorts children elements', () => {
    $element.children = [
      {'order-alpha': '2', getAttribute: () => 2},
      {'order-alpha': '3', getAttribute: () => 3},
      {'order-alpha': '1', getAttribute: () => 1},
    ];

    const expectedOrder = [
      {'order-alpha': '1', getAttribute: () => 1},
      {'order-alpha': '2', getAttribute: () => 2},
      {'order-alpha': '3', getAttribute: () => 3},
    ];

    sortChildren($element, 'order-alpha', Number.parseInt);
    expect(JSON.stringify($element.children)).toEqual(
      JSON.stringify(expectedOrder),
    );
  });
});

describe('::replaceChildren', () => {
  it('replace children elements', () => {
    $element.children = [
      {'order-alpha': 2, getAttribute: () => 2},
      {'order-alpha': 3, getAttribute: () => 3},
      {'order-alpha': 1, getAttribute: () => 1},
    ];

    const expectedNewChildren = [
      {'order-alpha': 3, getAttribute: () => 3},
      {'order-alpha': 1, getAttribute: () => 1},
      {'order-alpha': 2, getAttribute: () => 2},
    ];

    replaceChildren($element, expectedNewChildren);
    expect(JSON.stringify($element.children)).toEqual(
      JSON.stringify(expectedNewChildren),
    );
  });
});
