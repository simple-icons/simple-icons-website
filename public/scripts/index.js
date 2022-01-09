import '../stylesheet.css';

import * as domUtils from './dom-utils.js';
import newStorage from './storage.js';

import initCopyButtons from './copy.js';
import initColorScheme from './color-scheme.js';
import initOrdering from './ordering.js';
import initDownloadType from './download-type.js';
import initSearch from './search.js';
import initModal from './modal.js';
import initMenu from './menu.js';

document.body.classList.remove('no-js');

const storage = newStorage(localStorage);
initMenu(document, domUtils);
initColorScheme(document, storage);
initCopyButtons(document, navigator, fetch);
const orderingControls = initOrdering(document, storage);
initSearch(window.history, document, orderingControls, domUtils);
initDownloadType(document, storage);
initModal(document, domUtils);
