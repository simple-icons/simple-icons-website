import { ORDER_RELEVANCE } from './ordering.js';
import { decodeURIComponent, debounce, normalizeSearchTerm } from './utils.js';
import { Searcher } from 'fast-fuzzy';

const QUERY_PARAMETER = 'q';

function getQueryFromParameter(location, parameter) {
  const expr = new RegExp(`[\\?&]${parameter}=([^&#]*)`);
  const results = expr.exec(location.search);
  if (results !== null) {
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  return '';
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

  const $searchInput = document.getElementById('search-input');
  const $searchClear = document.getElementById('search-clear');
  const $orderByColor = document.getElementById('order-color');
  const $orderByRelevance = document.getElementById('order-relevance');

  const $gridItemIfEmpty = document.querySelector('.grid-item--if-empty');
  const $icons = document.querySelectorAll('.grid-item[data-brand]');
  const searcher = new Searcher($icons, {
    keySelector: (obj) => obj.dataset.brand,
  });
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
    $searchInput.focus();
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
      domUtils.hideElement($searchClear);
      domUtils.hideElement($orderByRelevance);
      domUtils.removeClass($orderByRelevance, 'last__button');
      domUtils.addClass($orderByColor, 'last__button');
      if (ordering.currentOrderingIs(ORDER_RELEVANCE)) {
        ordering.resetOrdering();
      }
      domUtils.hideElement($gridItemIfEmpty);

      $icons.forEach(($icon) => domUtils.showElement($icon));
      return;
    }

    domUtils.showElement($searchClear);
    domUtils.showElement($orderByRelevance);
    domUtils.addClass($orderByRelevance, 'last__button');
    domUtils.removeClass($orderByColor, 'last__button');

    if (activeQuery === '') {
      ordering.selectOrdering(ORDER_RELEVANCE);
    }

    const result = searcher.search(query);
    let noResults = true;
    $icons.forEach(($icon) => {
      const score = result.indexOf($icon);
      if (score === -1) {
        $icon.removeAttribute('order-relevance');
        domUtils.hideElement($icon);
      } else {
        $icon.setAttribute('order-relevance', 1 + score);
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
