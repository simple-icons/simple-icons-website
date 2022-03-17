import { ORDER_ALPHA, ORDER_RELEVANCE } from './ordering.js';
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

function getNonIcons() {
  const nonIcons = [];
  for (let child of document.querySelector('ul.grid').children) {
    // grid item if empty node is and other nodes like carbon ads are always
    // included in the result
    if (!child.classList.contains('grid-item')) {
      nonIcons.push(child);
    } else {
      break;
    }
  }

  return nonIcons;
}

export default function initSearch(history, document, ordering, domUtils) {
  let activeQuery = '';

  const $searchInput = document.getElementById('search-input');
  const $searchClear = document.getElementById('search-clear');
  const $orderByColor = document.getElementById('order-color');
  const $orderByRelevance = document.getElementById('order-relevance');

  const $gridItemIfEmpty = document.querySelector('.grid-item--if-empty');

  // when loaded for first time, all icon nodes exist in the DOM
  const $icons = document.querySelectorAll('.grid-item[data-brand]');
  const $allIcons = [...$icons];

  // the searcher is initialized for all icons
  const searcher = new Searcher($icons, {
    keySelector: (obj) => obj.dataset.brand,
  });

  $searchInput.disabled = false;
  $searchInput.focus();
  $searchInput.addEventListener(
    'input',
    debounce((event) => {
      const value = $searchInput.value;
      search(value);
    }),
  );

  $searchClear.addEventListener('click', (event) => {
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
      domUtils.hideElement($gridItemIfEmpty);

      // add all icons to the grid again
      domUtils.replaceChildren(
        document.querySelector('ul.grid'),
        getNonIcons().concat($allIcons),
      );
      setTimeout(() => {
        // reset to the preferred ordering
        ordering.resetOrdering();
      }, 5);

      return;
    }

    domUtils.showElement($searchClear);
    domUtils.showElement($orderByRelevance);
    domUtils.addClass($orderByRelevance, 'last__button');
    domUtils.removeClass($orderByColor, 'last__button');

    // fuzzy search
    let result = searcher.search(query);
    const nonIcons = getNonIcons();
    result = nonIcons.concat(result);

    ordering.selectOrdering(ORDER_RELEVANCE, result);
    if (result.length !== nonIcons.length) {
      domUtils.hideElement($gridItemIfEmpty);
    } else {
      domUtils.showElement($gridItemIfEmpty);
    }

    activeQuery = query;
  }
}
