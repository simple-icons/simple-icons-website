import { ORDER_BY_RELEVANCE } from './ordering.js';
import { decodeURIComponent, debounce, normalizeSearchTerm } from './utils.js';

const QUERY_PARAMETER = 'q';

function getQueryFromParameter(location, parameter) {
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

function setSearchQueryInURL(history, path, query) {
  if (query !== '') {
    history.replaceState(
      null,
      '',
      `${path}?${QUERY_PARAMETER}=${encodeURIComponent(query)}`,
    );
  } else {
    history.replaceState(null, '', path);
  }
}

export default function initSearch(history, document, ordering, domUtils) {
  let activeQuery = '';

  const $searchInput = document.getElementById('id-search-input');
  const $searchClear = document.getElementById('id-search-clear');
  const $orderByRelevance = document.getElementById('id-order-relevance');
  const $gridItemIfEmpty = document.querySelector('.grid-item--if-empty');
  const $adSpace = document.getElementById('carbonads');
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
  const query = getQueryFromParameter(document.location, QUERY_PARAMETER);
  if (query) {
    $searchInput.value = query;
    search(query);
  }

  function search(rawQuery) {
    setSearchQueryInURL(history, document.location.pathname, rawQuery);
    const query = normalizeSearchTerm(rawQuery);
    if (query !== '') {
      domUtils.showElement($searchClear);
      domUtils.showElement($orderByRelevance);
      domUtils.hideElement($adSpace);
      if (activeQuery === '') {
        ordering.selectOrdering(ORDER_BY_RELEVANCE);
      }
    } else {
      domUtils.hideElement($searchClear);
      domUtils.hideElement($orderByRelevance);
      domUtils.showElement($adSpace);
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
  }
}
