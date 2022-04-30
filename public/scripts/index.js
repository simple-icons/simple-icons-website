import '../stylesheet.css';

import * as domUtils from './dom-utils.js';
import newStorage from './storage.js';

import initOrdering from './ordering.js';

document.body.classList.remove('no-js');

const storage = newStorage(localStorage);
const orderingControls = initOrdering(window, document, storage, domUtils);

const detachedInitColorScheme = async () => {
  const { default: initColorScheme } = await import('./color-scheme.js');
  initColorScheme(document, storage);
};

const detachedInitCopyButtons = async () => {
  const { default: initCopyButtons } = await import('./copy.js');
  initCopyButtons(document, navigator, fetch);
};

const detachedInitSearch = async () => {
  const { default: initSearch } = await import('./search.js');

  // detach searcher initialization to avoid blocking the page loading
  setTimeout(() => {
    initSearch(window.history, document, orderingControls, domUtils);
  }, 0);
};

const detachedInitDownloadType = async () => {
  const { default: initDownloadType } = await import('./download-type.js');
  initDownloadType(document, storage);
};

const detachedInitModal = async () => {
  const { default: initModal } = await import('./modal.js');
  initModal(document, domUtils);
};

detachedInitColorScheme();
detachedInitCopyButtons();
detachedInitSearch();
detachedInitDownloadType();
detachedInitModal();
