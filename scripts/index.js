import '../stylesheet.css';

import initCopyButtons from './copy.js';
import initOrdering from './ordering.js';
import initSearch from './search.js';
import {
  debounce,
  normalizeSearchTerm,
} from './utils.js';

document.body.classList.remove('no-js');

initCopyButtons(document);
const orderingControls = initOrdering(document, localStorage);
initSearch(document, debounce, normalizeSearchTerm, orderingControls);
