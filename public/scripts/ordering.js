import { STORAGE_KEY_ORDERING } from './storage.js';

export const ORDER_ALPHA = 'order-alpha';
export const ORDER_COLOR = 'order-color';
export const ORDER_RELEVANCE = 'order-relevance';

const DEFAULT_ORDERING = ORDER_ALPHA;

export default (window, document, storage, domUtils) => {
  let activeOrdering = DEFAULT_ORDERING;
  let preferredOrdering = DEFAULT_ORDERING;

  const $body = document.querySelector('body');
  const $orderAlpha = document.getElementById('order-alpha');
  const $orderColor = document.getElementById('order-color');

  $orderAlpha.disabled = false;
  $orderColor.disabled = false;

  const currentOrderingIs = (value) => {
    return activeOrdering === value;
  };

  const selectOrdering = (selected, newItems) => {
    if (newItems === undefined && selected === activeOrdering) {
      // only skip ordering when is the same if not an ordering
      // with defined children set
      return;
    }

    $body.classList.remove(ORDER_ALPHA, ORDER_COLOR, ORDER_RELEVANCE);
    $body.classList.add(selected);

    const $grid = document.querySelector('ul.grid');
    if (newItems) {
      domUtils.replaceChildren($grid, newItems, 30);
    } else {
      window.scrollTo(0, 0);
      domUtils.sortChildren($grid, selected, 30);
    }

    if (selected !== ORDER_RELEVANCE) {
      preferredOrdering = selected;
      storage.setItem(STORAGE_KEY_ORDERING, selected);
    }

    activeOrdering = selected;
  };

  const resetOrdering = () => {
    return selectOrdering(preferredOrdering);
  };

  if (storage.hasItem(STORAGE_KEY_ORDERING)) {
    const storedOrdering = storage.getItem(STORAGE_KEY_ORDERING);
    selectOrdering(storedOrdering);
  }

  $orderAlpha.addEventListener('click', () => {
    selectOrdering(ORDER_ALPHA);
  });
  $orderColor.addEventListener('click', () => {
    selectOrdering(ORDER_COLOR);
  });

  return {
    currentOrderingIs,
    selectOrdering,
    resetOrdering,
  };
};
