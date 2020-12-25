export const ORDER_ALPHABETICALLY = 'alphabetically';
export const ORDER_BY_COLOR = 'color';
export const ORDER_BY_RELEVANCE = 'relevance';

const DEFAULT_ORDERING = ORDER_ALPHABETICALLY;

const CLASS_ORDER_ALPHABETICALLY = 'order-alphabetically';
const CLASS_ORDER_BY_COLOR = 'order-by-color';
const CLASS_ORDER_BY_RELEVANCE = 'order-by-relevance';

const ORDERING_PREFERENCE_KEY = 'ordering-preference';

let $body;
let $storage;

let activeOrdering = DEFAULT_ORDERING;
let preferredOrdering = DEFAULT_ORDERING;

function storableOrdering(selected) {
  return selected === ORDER_ALPHABETICALLY
      || selected === ORDER_BY_COLOR;
}

export function currentOrderingIs(value) {
  return activeOrdering === value;
}

export function selectOrdering(selected) {
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

  if ($storage && storableOrdering(selected)) {
    $storage.setItem(ORDERING_PREFERENCE_KEY, selected);
  }

  if (selected !== ORDER_BY_RELEVANCE) {
    preferredOrdering = selected;
  }

  activeOrdering = selected;
}

export function resetOrdering() {
  return selectOrdering(preferredOrdering);
}

export default function initOrdering(
  document,
  localStorage,
) {
  $body = document.querySelector('body');
  $storage = localStorage;

  const $orderAlphabetically = document.getElementById('order-alpha');
  const $orderByColor = document.getElementById('order-color');
  const $orderByRelevance = document.getElementById('order-relevance');

  if ($storage) {
    const storedOrdering = $storage.getItem(ORDERING_PREFERENCE_KEY);
    if (storedOrdering) {
      selectOrdering(storedOrdering);
    }
  }

  $orderAlphabetically.addEventListener('click', (event) => {
    event.preventDefault();

    if (activeOrdering != ORDER_ALPHABETICALLY) {
      selectOrdering(ORDER_ALPHABETICALLY);
      $orderAlphabetically.blur();
    }
  });
  $orderByColor.addEventListener('click', (event) => {
    event.preventDefault();

    if (activeOrdering != ORDER_BY_COLOR) {
      selectOrdering(ORDER_BY_COLOR);
      $orderByColor.blur();
    }
  });
  $orderByRelevance.addEventListener('click', (event) => {
    event.preventDefault();

    if (activeOrdering != ORDER_BY_RELEVANCE) {
      selectOrdering(ORDER_BY_RELEVANCE);
      $orderByRelevance.blur();
    }
  });
}
