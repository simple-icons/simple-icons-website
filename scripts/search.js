import {
  ORDER_BY_RELEVANCE,

  currentOrderingIs,
  selectOrdering,
  resetOrdering,
} from './ordering.js';

const queryParameter = 'q';

const CLASS_SEARCH_ACTIVE = 'search-active';
const CLASS_SEARCH_EMPTY = 'search-empty';

let activeQuery = '';

export default function initSearch(
  document,
  debounce,
  normalizeSearchTerm,
) {
  const $body = document.querySelector('body');
  const $searchInput = document.getElementById('search-input');
  const $searchClear = document.getElementById('search-clear');
  const $icons = document.querySelectorAll('.grid-item[data-brand]');

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

  function search(rawQuery) {
    $body.classList.toggle(CLASS_SEARCH_ACTIVE, rawQuery !== '');

    if (rawQuery) {
      window.history.replaceState(null, '', '?' + queryParameter + '=' + rawQuery);
    } else {
      window.history.replaceState(null, '', '/');
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

    $body.classList.toggle(CLASS_SEARCH_EMPTY, noResults);

    if (query === '' && currentOrderingIs(ORDER_BY_RELEVANCE)) {
      resetOrdering();
    }

    if (query !== '' && activeQuery === '') {
      selectOrdering(ORDER_BY_RELEVANCE);
    }

    activeQuery = query;
  }

  function getScore(query, iconName) {
    var score = iconName.length - query.length;
    var index = 0;

    for (const letter of query) {
      index = iconName.indexOf(letter, index);
      if (index === -1) {
        return -1;
      }

      score += index;
      index++;
    }

    // element.style.setProperty("--order-relevance", score);
    // element.classList.remove('hidden');
    return score;
  }



  // Restore ordering preference of the user. This should be performed before
  // applying the search query as it would overwrite "order by relevance"
  // if (localStorage) {
  //   var storedOrderingId = localStorage.getItem(orderingPreferenceIdentifier);
  //   var ordering = document.getElementById(storedOrderingId);
  //   if (ordering) selectOrdering(ordering);
  // }

  // Load search query if present
  var query = getQueryFromParameter(queryParameter);
  if (query) {
    // $searchInput.classList.add('search--active');
    $searchInput.value = query;
    search(query);
  }

  function getQueryFromParameter() {
    var results = /[\\?&]q=([^&#]*)/.exec(location.search);
    if (results !== null) {
      return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    return '';
  }
}