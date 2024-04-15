import {STORAGE_KEY_ORDERING} from './storage.js';

export const ORDER_ALPHA = 'order-alpha';
export const ORDER_COLOR = 'order-color';
export const ORDER_RELEVANCE = 'order-relevance';

const DEFAULT_ORDERING = ORDER_ALPHA;

export default function ordering(window, document, storage, domUtils) {
  let activeOrdering = DEFAULT_ORDERING;
  let preferredOrdering = DEFAULT_ORDERING;

  const $body = document.querySelector('body');
  const $orderAlpha = document.querySelector('#order-alpha');
  const $orderColor = document.querySelector('#order-color');

  $orderAlpha.disabled = false;
  $orderColor.disabled = false;

  const currentOrderingIs = (value) => {
    return activeOrdering === value;
  };

  const selectOrdering = (selected, newItems) => {
    if (selected !== ORDER_RELEVANCE && selected === activeOrdering) {
      // Only skip ordering when is the same if not searching
      return;
    }

    $body.classList.replace(activeOrdering, selected);

    const $grid = document.querySelector('ul.grid');
    if (selected === ORDER_RELEVANCE) {
      domUtils.replaceChildren($grid, newItems, 30);
    } else {
      window.scrollTo(0, 0);
      // Color and alpha orderings are stored in a `o` attribute
      // and we must extract the number from it
      const sortAttributeGetter =
        selected === ORDER_ALPHA
          ? (a) => Number.parseInt(a.split('-')[0], 10)
          : (a) => Number.parseInt(a.split('-')[1], 10);
      domUtils.sortChildren($grid, 'o', sortAttributeGetter, 30);
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
}
