import { ORDER_BY_RELEVANCE } from './ordering.js';
import {
  decodeURIComponent,
  debounce,
  normalizeSearchTerm,
  paramFromURL,
  QUERY_PARAMETER,
  setParameterInURL,
} from './utils.js';

function getScore(query, iconName) {
  let score = iconName.length - query.length;
  let index = 0;

  for (const letter of query) {
    index = iconName.indexOf(letter, index);
    if (index === -1) {
      return -1;
    }

    score += index;
    index++;
  }

  return score;
}

export default function initSearch(history, document, ordering, domUtils) {
  let activeQuery = '';

  const $searchInput = document.getElementById('search-input');
  const $searchClear = document.getElementById('search-clear');
  const $orderByColor = document.getElementById('order-color');
  const $orderByRelevance = document.getElementById('order-relevance');
  const $gridItemIfEmpty = document.querySelector('.grid-item--if-empty');
  const $icons = document.querySelectorAll('.grid-item[data-brand]');

  $searchInput.disabled = false;
  $searchInput.focus();
  $searchInput.addEventListener(
    'input',
    debounce((event) => {
      event.preventDefault();
      const value = $searchInput.value;
      search(value);
    }),
  );

  $searchClear.addEventListener('click', (event) => {
    event.preventDefault();
    $searchInput.value = '';
    search('');
  });

  // Load search query if present
  const query = paramFromURL(document.location, QUERY_PARAMETER);
  if (query) {
    $searchInput.value = query;
    search(query);
  }

  function search(rawQuery) {
    const query = normalizeSearchTerm(rawQuery);
    if (query !== '') {
      domUtils.showElement($searchClear);
      domUtils.showElement($orderByRelevance);
      domUtils.addClass($orderByRelevance, 'last__button');
      domUtils.removeClass($orderByColor, 'last__button');
      if (activeQuery === '') {
        ordering.selectOrdering(ORDER_BY_RELEVANCE);
      }
    } else {
      domUtils.hideElement($searchClear);
      domUtils.hideElement($orderByRelevance);
      domUtils.removeClass($orderByRelevance, 'last__button');
      domUtils.addClass($orderByColor, 'last__button');
      if (ordering.currentOrderingIs(ORDER_BY_RELEVANCE)) {
        ordering.resetOrdering();
      }
    }

    let noResults = true;
    $icons.forEach(($icon) => {
      const brandName = $icon.getAttribute('data-brand');
      const score = getScore(query, brandName);
      if (score < 0) {
        $icon.style.removeProperty('--order-relevance');
        domUtils.hideElement($icon);
      } else {
        $icon.style.setProperty('--order-relevance', score);
        domUtils.showElement($icon);
        noResults = false;
      }
    });

    if (noResults) {
      domUtils.showElement($gridItemIfEmpty);
    } else {
      domUtils.hideElement($gridItemIfEmpty);
    }

    activeQuery = query;

    setParameterInURL(QUERY_PARAMETER, rawQuery);
  }
}
