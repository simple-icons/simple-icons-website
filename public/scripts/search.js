import { ORDER_BY_RELEVANCE } from './ordering.js';
import { decodeURIComponent, debounce, normalizeSearchTerm } from './utils.js';
const { Searcher } = require('fast-fuzzy');

const QUERY_PARAMETER = 'q';

function getQueryFromParameter(location, parameter) {
  const expr = new RegExp(`[\\?&]${parameter}=([^&#]*)`);
  const results = expr.exec(location.search);
  if (results !== null) {
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  return '';
}

function getScore(results, iconName) {
  const result = results.find((r) => r.original === iconName);
  return result ? result.score : -1;
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

const keySelector = (icon) => icon.querySelector('h2').textContent;

export default function initSearch(history, document, ordering, domUtils) {
  let activeQuery = '';

  const $searchInput = document.getElementById('search-input');
  const $searchClear = document.getElementById('search-clear');
  const $orderByRelevance = document.getElementById('order-relevance');
  const $gridItemIfEmpty = document.querySelector('.grid-item--if-empty');
  const $icons = document.querySelectorAll('.grid-item[data-brand]');
  const searcher = new Searcher($icons, { keySelector: keySelector });

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
  $searchInput.addEventListener('change', () => {
    $searchInput.blur();
  });

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
    if (!query) {
      domUtils.showElement($searchClear);
      domUtils.showElement($orderByRelevance);
      if (activeQuery === '') {
        ordering.selectOrdering(ORDER_BY_RELEVANCE);
      }
    } else {
      domUtils.hideElement($searchClear);
      domUtils.hideElement($orderByRelevance);
      if (ordering.currentOrderingIs(ORDER_BY_RELEVANCE)) {
        ordering.resetOrdering();
      }
    }
    const results = searcher.search(query, { returnMatchData: true });
    let noResults = true;
    $icons.forEach(($icon) => {
      const brandName = $icon.querySelector('h2').textContent;
      const score = getScore(results, brandName);
      if (score < 0) {
        $icon.style.removeProperty('--order-relevance');
        domUtils.hideElement($icon);
      } else {
        $icon.style.setProperty('--order-relevance', -1 * score);
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
