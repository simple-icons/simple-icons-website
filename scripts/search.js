import { ORDER_BY_RELEVANCE } from './ordering.js';
import {
  decodeURIComponent,
  debounce,
  normalizeSearchTerm,
} from './utils.js';

const queryParameter = 'q';

let activeQuery = '';

function getQueryFromParameter() {
  const results = /[\\?&]q=([^&#]*)/.exec(location.search);
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
  window,
  document,
  ordering,
) {
  const $searchInput = document.getElementById('search-input');
  const $searchClear = document.getElementById('search-clear');
  const $orderByRelevance = document.getElementById('order-relevance');
  const $$gridItemIfEmpty = document.querySelector('.grid-item--if-empty');
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
  const query = getQueryFromParameter(queryParameter);
  if (query) {
    $searchInput.value = query;
    search(query);
  }

  function search(rawQuery) {
    if (rawQuery) {
      window.history.replaceState(null, '', '?' + queryParameter + '=' + rawQuery);
      $searchClear.classList.remove('hidden');
      $searchClear.removeAttribute('aria-hidden');
    } else {
      window.history.replaceState(null, '', '/');
      $searchClear.classList.add('hidden');
      $searchClear.setAttribute('aria-hidden', 'true');
    }

    const query = normalizeSearchTerm(rawQuery);

    let noResults = true;
    $icons.forEach(($icon) => {
      const brandName = $icon.getAttribute('data-brand');
      const score = getScore(query, brandName);
      if (score < 0) {
        $icon.style.removeProperty("--order-relevance");
        $icon.classList.add('hidden');
        $icon.setAttribute('aria-hidden', 'true');
      } else {
        $icon.style.setProperty("--order-relevance", score);
        $icon.classList.remove('hidden');
        $icon.removeAttribute('aria-hidden');
        noResults = false;
      }
    });

    if (noResults) {
      $$gridItemIfEmpty.classList.remove('hidden');
      $$gridItemIfEmpty.removeAttribute('aria-hidden');
    } else {
      $$gridItemIfEmpty.classList.add('hidden');
      $$gridItemIfEmpty.setAttribute('aria-hidden', 'true');
    }

    if (query === '') {
      $orderByRelevance.classList.add('hidden');
      $orderByRelevance.setAttribute('aria-hidden', true);

      if (ordering.currentOrderingIs(ORDER_BY_RELEVANCE)) {
        ordering.resetOrdering();
      }
    }

    if (query !== '') {
      $orderByRelevance.classList.remove('hidden');
      $orderByRelevance.removeAttribute('aria-hidden');

      if (activeQuery === '') {
        ordering.selectOrdering(ORDER_BY_RELEVANCE);
      }
    }

    activeQuery = query;
  }
}
