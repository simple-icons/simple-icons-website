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

const detachedInitData = async () => {
  const iconsData = await import('./data.js');
  const { default: initData } = iconsData;
  initData();
  return iconsData;
};

const detachedInitModal = async (iconsData) => {
  const { default: initModal } = await import('./modal.js');
  initModal(document, domUtils, iconsData);
};

const detachedInitLayout = async () => {
  const { default: initLayout } = await import('./layout.js');
  initLayout(document, storage);
};

(async () => {
  detachedInitColorScheme();
  detachedInitCopyButtons();
  detachedInitSearch();
  detachedInitDownloadType();
  const iconsData = await detachedInitData();
  detachedInitModal(iconsData);
  detachedInitLayout();
})();
