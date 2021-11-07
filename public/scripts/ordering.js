import { STORAGE_KEY_ORDERING } from './storage.js';

export const ORDER_ALPHABETICALLY = 'alphabetically';
export const ORDER_BY_COLOR = 'color';
export const ORDER_BY_RELEVANCE = 'relevance';

const DEFAULT_ORDERING = ORDER_ALPHABETICALLY;

const CLASS_ORDER_ALPHABETICALLY = 'order-alphabetically';
const CLASS_ORDER_BY_COLOR = 'order-by-color';
const CLASS_ORDER_BY_RELEVANCE = 'order-by-relevance';

export default function initOrdering(document, storage) {
  let activeOrdering = DEFAULT_ORDERING;
  let preferredOrdering = DEFAULT_ORDERING;

  const $body = document.querySelector('body');
  const $orderAlphabetically = document.getElementById('order-alpha');
  const $orderByColor = document.getElementById('order-color');
  const $orderByRelevance = document.getElementById('order-relevance');

  $orderAlphabetically.disabled = false;
  $orderByColor.disabled = false;
  $orderByRelevance.disabled = false;

  if (storage.hasItem(STORAGE_KEY_ORDERING)) {
    const storedOrdering = storage.getItem(STORAGE_KEY_ORDERING);
    selectOrdering(storedOrdering);
  }

  $orderAlphabetically.addEventListener('click', (event) => {
    event.preventDefault();
    selectOrdering(ORDER_ALPHABETICALLY);
  });
  $orderByColor.addEventListener('click', (event) => {
    event.preventDefault();
    selectOrdering(ORDER_BY_COLOR);
  });
  $orderByRelevance.addEventListener('click', (event) => {
    event.preventDefault();
    selectOrdering(ORDER_BY_RELEVANCE);
  });

  function currentOrderingIs(value) {
    return activeOrdering === value;
  }

  function selectOrdering(selected) {
    if (selected === activeOrdering) {
      return;
    }

    $body.classList.remove(
      CLASS_ORDER_ALPHABETICALLY,
      CLASS_ORDER_BY_COLOR,
      CLASS_ORDER_BY_RELEVANCE,
    );

    if (selected === ORDER_ALPHABETICALLY) {
      $body.classList.add(CLASS_ORDER_ALPHABETICALLY);
    } else if (selected === ORDER_BY_COLOR) {
      $body.classList.add(CLASS_ORDER_BY_COLOR);
    } else if (selected === ORDER_BY_RELEVANCE) {
      $body.classList.add(CLASS_ORDER_BY_RELEVANCE);
    }

    if (selected !== ORDER_BY_RELEVANCE) {
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
