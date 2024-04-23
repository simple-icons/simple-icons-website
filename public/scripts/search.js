import {Searcher} from 'fast-fuzzy';
import {ORDER_RELEVANCE} from './ordering.js';
import {debounce} from './utils.js';

const QUERY_PARAMETER = 'q';

const getQueryFromParameter = (location, parameter) => {
  const query = new URLSearchParams(location.search).get(parameter);
  return query || '';
};

const setSearchQueryInURL = (history, path, query) => {
  if (query) {
    history.replaceState(
      null,
      '',
      `${path}?${new URLSearchParams({
        ...(query ? {[QUERY_PARAMETER]: query} : {}),
      }).toString()}`,
    );
  } else {
    history.replaceState(null, '', path);
  }
};

const titlesFromIconCard = (iconCard) => {
  // Extract title from icon card
  const previewButtonTitle =
    iconCard.children[0].children[0].getAttribute('title');

  const variants = [
    // Title
    previewButtonTitle.slice(0, -4),
  ];

  // Add aliases
  const aliases = iconCard.getAttribute('a');
  if (aliases !== null) {
    Array.prototype.push.apply(variants, JSON.parse(aliases));
  }

  return variants;
};

export default function search(history, document, ordering, domUtils) {
  const $searchInput = document.querySelector('#search-input');
  const $searchClear = document.querySelector('#search-clear');
  const $orderColor = document.querySelector('#order-color');
  const $orderRelevance = document.querySelector('#order-relevance');

  // When loaded for first time, all icon nodes exist in the DOM
  const $icons = document.querySelectorAll('.grid-item');

  // Mantain a copy in memory to be able to rebuild the whole grid later
  const $allIcons = [...$icons];

  // The searcher is initialized for all icons
  const searcher = new Searcher($icons, {keySelector: titlesFromIconCard});

  function getNonIcons() {
    const nonIcons = [];
    for (const node of document.querySelector('ul.grid').children) {
      // Carbon ads
      if (node.classList.contains('grid-item')) {
        // These non-icon nodes are placed first in the grid
        break;
      } else {
        nonIcons.push(node);
      }
    }

    return nonIcons;
  }

  const search = (query) => {
    setSearchQueryInURL(history, document.location.pathname, query);
    if (!query) {
      domUtils.hideElement($searchClear);
      domUtils.hideElement($orderRelevance);
      $orderRelevance.classList.remove('last__button');
      $orderColor.classList.add('last__button');

      // Add all icons to the grid again
      const $gridChildren = document.querySelector('ul.grid').children;
      domUtils.replaceChildren(
        document.querySelector('ul.grid'),
        // eslint-disable-next-line unicorn/prefer-spread
        getNonIcons($gridChildren).concat($allIcons),
      );
      // And reset to the preferred ordering
      ordering.resetOrdering();

      return;
    }

    domUtils.showElement($searchClear);
    domUtils.showElement($orderRelevance);
    $orderRelevance.classList.add('last__button');
    $orderColor.classList.remove('last__button');

    // Fuzzy search
    let result = searcher.search(query);
    const $gridChildren = document.querySelector('ul.grid').children;
    const nonIcons = getNonIcons($gridChildren);
    // eslint-disable-next-line unicorn/prefer-spread
    result = nonIcons.concat(result);

    ordering.selectOrdering(ORDER_RELEVANCE, result);
  };

  $searchInput.disabled = false;
  $searchInput.focus();
  $searchInput.addEventListener(
    'input',
    debounce(() => {
      search($searchInput.value);
    }),
  );

  $searchClear.addEventListener('click', () => {
    $searchInput.value = '';
    search('');
    $searchInput.focus();
  });

  $orderRelevance.addEventListener('click', () => {
    search($searchInput.value);
  });
  $orderRelevance.disabled = false;

  // Load search query if present
  const query = getQueryFromParameter(document.location, QUERY_PARAMETER);
  if (query) {
    $searchInput.value = query;
    search(query);
  }
}
