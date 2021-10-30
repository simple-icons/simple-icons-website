import { STORAGE_KEY_ORDERING } from './storage.js';
import {
  paramFromURL,
  ORDER_PARAMETER,
  setParameterInURL,
  initControlButton,
} from './utils.js';

export const ORDER_ALPHABETICALLY = 'order-alphabetically';
export const ORDER_BY_COLOR = 'order-color';
export const ORDER_BY_RELEVANCE = 'order-relevance';

const DEFAULT_ORDERING = ORDER_ALPHABETICALLY;

export default function initOrdering(document, history, storage) {
  let activeOrdering = DEFAULT_ORDERING;
  let preferredOrdering = DEFAULT_ORDERING;

  const $body = document.querySelector('body');

  const ordering = paramFromURL(document.location, ORDER_PARAMETER);
  if (ordering) {
    selectOrdering(ordering, false);
  } else if (storage.hasItem(STORAGE_KEY_ORDERING)) {
    const storedOrdering = storage.getItem(STORAGE_KEY_ORDERING);
    selectOrdering(storedOrdering);
  }

  initControlButton(
    document,
    'order-alpha',
    ORDER_ALPHABETICALLY,
    selectOrdering,
  );
  initControlButton(document, 'order-color', ORDER_BY_COLOR, selectOrdering);
  initControlButton(
    document,
    'order-relevance',
    ORDER_BY_RELEVANCE,
    selectOrdering,
  );

  function currentOrderingIs(value) {
    return activeOrdering === value;
  }

  function selectOrdering(selected, persistLocally = true) {
    if (selected === activeOrdering) {
      return;
    }

    $body.classList.remove(
      ORDER_ALPHABETICALLY,
      ORDER_BY_COLOR,
      ORDER_BY_RELEVANCE,
    );

    $body.classList.add(selected);
    if (selected !== ORDER_BY_RELEVANCE) {
      console.log(selected);
      preferredOrdering = selected;
      if (persistLocally) storage.setItem(STORAGE_KEY_ORDERING, selected);
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
