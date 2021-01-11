import { hideElement, showElement } from './dom-utils.js';
import { ORDER_BY_RELEVANCE } from './ordering.js';
import {
  decodeURIComponent,
  debounce,
  normalizeSearchTerm,
} from './utils.js';

const QUERY_PARAMETER = 'q';

let activeQuery = '';

function getQueryFromParameter(parameter) {
  const expr = new RegExp(`[\\?&]${parameter}=([^&#]*)`);
  const results = expr.exec(location.search);
  if (results !== null) {
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  return '';
}

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

export default function initSearch(
  history,
  document,
  ordering,
) {
  const $searchInput = document.getElementById('search-input');
  const $searchClear = document.getElementById('search-clear');
  const $orderByRelevance = document.getElementById('order-relevance');
  const $gridItemIfEmpty = document.querySelector('.grid-item--if-empty');
  const $icons = document.querySelectorAll('.grid-item[data-brand]');

  $searchInput.disabled = false;
  $searchInput.focus();
  $searchInput.addEventListener('input', debounce((event) => {
    event.preventDefault();
    const value = $searchInput.value;
    search(value);
  }));

  $searchClear.addEventListener('click', (event) => {
    event.preventDefault();
    $searchInput.value = '';
    search('');
  });

  // Load search query if present
  const query = getQueryFromParameter(QUERY_PARAMETER);
  if (query) {
    $searchInput.value = query;
    search(query);
  }

  function search(rawQuery) {
    const query = normalizeSearchTerm(rawQuery);
    if (query !== '') {
      history.replaceState(null, '', `?${QUERY_PARAMETER}=${encodeURIComponent(rawQuery)}`);
      showElement($searchClear);
      showElement($orderByRelevance)
      if (activeQuery === '') {
        ordering.selectOrdering(ORDER_BY_RELEVANCE);
      }
    } else {
      history.replaceState(null, '', '/');
      hideElement($searchClear);
      hideElement($orderByRelevance)
      if (ordering.currentOrderingIs(ORDER_BY_RELEVANCE)) {
        ordering.resetOrdering();
      }
    }

    let noResults = true;
    $icons.forEach(($icon) => {
      const brandName = $icon.getAttribute('data-brand');
      const score = getScore(query, brandName);
      if (score < 0) {
        $icon.style.removeProperty("--order-relevance");
        hideElement($icon);
      } else {
        $icon.style.setProperty("--order-relevance", score);
        showElement($icon);
        noResults = false;
      }
    });

    if (noResults) {
      showElement($gridItemIfEmpty);
    } else {
      hideElement($gridItemIfEmpty);
    }

    activeQuery = query;
  }
}
