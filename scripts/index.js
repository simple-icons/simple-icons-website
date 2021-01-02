import '../stylesheet.css';

import initCopyButtons from './copy.js';
import initColorScheme from './color-scheme.js';
import initOrdering from './ordering.js';
import initSearch from './search.js';

document.body.classList.remove('no-js');

initColorScheme(document, localStorage);
initCopyButtons(document, navigator);
const orderingControls = initOrdering(document, localStorage);
initSearch(window, document, orderingControls);
