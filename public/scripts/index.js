import '../stylesheet.css';

import initCopyButtons from './copy.js';
import initColorScheme from './color-scheme.js';
import initOrdering from './ordering.js';
import initSearch from './search.js';
import initFeedbackRequest from './feedback-request.js';
import newStorage from './storage.js';

document.body.classList.remove('no-js');

const storage = newStorage(localStorage);
initColorScheme(document, storage);
initCopyButtons(document, navigator);
const orderingControls = initOrdering(document, storage);
initSearch(window.history, document, orderingControls);
initFeedbackRequest(document, storage);
