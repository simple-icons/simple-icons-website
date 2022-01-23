import { STORAGE_KEY_ORDERING } from './storage.js';

export const ORDER_ALPHA = 'order-alpha';
export const ORDER_COLOR = 'order-color';
export const ORDER_RELEVANCE = 'order-relevance';

const DEFAULT_ORDERING = ORDER_ALPHA;

export default function initOrdering(document, storage, domUtils) {
  let activeOrdering = DEFAULT_ORDERING;
  let preferredOrdering = DEFAULT_ORDERING;

  const $body = document.querySelector('body');
  const $orderAlpha = document.getElementById('order-alpha');
  const $orderColor = document.getElementById('order-color');
  const $orderRelevance = document.getElementById('order-relevance');

  $orderAlpha.disabled = false;
  $orderColor.disabled = false;
  $orderRelevance.disabled = false;

  if (storage.hasItem(STORAGE_KEY_ORDERING)) {
    const storedOrdering = storage.getItem(STORAGE_KEY_ORDERING);
    selectOrdering(storedOrdering);
    domUtils.sortChildren(document.querySelector('ul.grid'), storedOrdering);
  }

  $orderAlpha.addEventListener('click', (event) => {
    event.preventDefault();
    selectOrdering(ORDER_ALPHA);
  });
  $orderColor.addEventListener('click', (event) => {
    event.preventDefault();
    selectOrdering(ORDER_COLOR);
  });
  $orderRelevance.addEventListener('click', (event) => {
    event.preventDefault();
    selectOrdering(ORDER_RELEVANCE);
  });

  function currentOrderingIs(value) {
    return activeOrdering === value;
  }

  function selectOrdering(selected) {
    if (selected === activeOrdering) {
      return;
    }

    $body.classList.remove(ORDER_ALPHA, ORDER_COLOR, ORDER_RELEVANCE);

    $body.classList.add(selected);

    domUtils.sortChildren(document.querySelector('ul.grid'), selected);

    if (selected !== ORDER_RELEVANCE) {
      preferredOrdering = selected;
      storage.setItem(STORAGE_KEY_ORDERING, selected);
    }

    activeOrdering = selected;
  }

  function resetOrdering() {
    return selectOrdering(preferredOrdering);
  }

  return {
    currentOrderingIs,
    selectOrdering,
    resetOrdering,
  };
}
