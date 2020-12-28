import '../stylesheet.css';

import initCopyButtons from './copy.js';
import initOrdering from './ordering.js';
import initSearch from './search.js';

document.body.classList.remove('no-js');

initCopyButtons(document, navigator);
const orderingControls = initOrdering(document, localStorage);
initSearch(window, document, orderingControls);
