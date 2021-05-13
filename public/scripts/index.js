import '../stylesheet.css';

import * as domUtils from './dom-utils.js';
import newStorage from './storage.js';

import initCopyButtons from './copy.js';
import initColorScheme from './color-scheme.js';
import initOrdering from './ordering.js';
import initSearch from './search.js';
import initFeedbackRequest from './feedback-request.js';

document.body.classList.remove('no-js');

const storage = newStorage(localStorage);
initColorScheme(document, storage);
initCopyButtons(window, document, navigator);
const orderingControls = initOrdering(document, storage);
initSearch(window.history, document, orderingControls, domUtils);
initFeedbackRequest(document, storage);
