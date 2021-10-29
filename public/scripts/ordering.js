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

export default function initOrdering(document, storage) {
  let activeOrdering = DEFAULT_ORDERING;
  let preferredOrdering = DEFAULT_ORDERING;

  const $body = document.querySelector('body');

  if (storage.hasItem(STORAGE_KEY_ORDERING)) {
    const storedOrdering = storage.getItem(STORAGE_KEY_ORDERING);
    selectOrdering(storedOrdering);
  }
  initControlButton('order-alpha', ORDER_ALPHABETICALLY, selectOrdering);
  initControlButton('order-color', ORDER_BY_COLOR, selectOrdering);
  initControlButton('order-relevance', ORDER_BY_RELEVANCE, selectOrdering);

  function currentOrderingIs(value) {
    return activeOrdering === value;
  }

  function selectOrdering(selected) {
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
