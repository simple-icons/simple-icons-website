import '../stylesheet.css';
import * as domUtils from './dom-utils.js';
import initOrdering from './ordering.js';
import newStorage from './storage.js';

document.body.classList.remove('no-js');

const storage = newStorage(localStorage);
const orderingControls = initOrdering(window, document, storage, domUtils);

const detachedInitIntersectionObserver = async () => {
  const {default: initIntersectionObserver} = await import('./iobserver.js');
  initIntersectionObserver(document);
};

const detachedInitColorScheme = async () => {
  const {default: initColorScheme} = await import('./color-scheme.js');
  initColorScheme(document, storage);
};

const detachedInitCopyButtons = async () => {
  const {default: initCopyButtons} = await import('./copy.js');
  initCopyButtons(document, navigator, fetch);
};

const detachedInitSearch = async () => {
  const {default: initSearch} = await import('./search.js');

  // Detach searcher initialization to avoid blocking the page loading
  setTimeout(() => {
    initSearch(window.history, document, orderingControls, domUtils);
  }, 0);
};

const detachedInitFilters = async () => {
  const {createCategoryFilterUI, applyCategoryFilters} = await import(
    './filters.js'
  );

  const controlElement = document.querySelector('.control');
  // Get categories from window (injected by webpack)
  const categories = window.__SIMPLE_ICONS_CATEGORIES__ || [];

  if (categories.length > 0 && controlElement) {
    const $icons = document.querySelectorAll('.grid-item');
    const $allIcons = [...$icons];
    const $gridElement = document.querySelector('ul.grid');

    const getNonIcons = () => {
      const nonIcons = [];
      for (const node of $gridElement.children) {
        if (node.classList.contains('grid-item')) {
          break;
        } else {
          nonIcons.push(node);
        }
      }

      return nonIcons;
    };

    // Const filterUI = createCategoryFilterUI(controlElement, categories, {
    //   onCategoryChange(selectedCategories) {
    //     applyCategoryFilters({
    //       selectedCategories,
    //       allIcons: $allIcons,
    //       gridElement: $gridElement,
    //       nonIcons: getNonIcons(),
    //       domUtils,
    //     });
    //   },
    // });
    createCategoryFilterUI(controlElement, categories, {
      onCategoryChange(selectedCategories) {
        applyCategoryFilters({
          selectedCategories,
          allIcons: $allIcons,
          gridElement: $gridElement,
          nonIcons: getNonIcons(),
          domUtils,
        });
      },
    });
  }
};

const detachedInitDownloadType = async () => {
  const {default: initDownloadType} = await import('./download-type.js');
  initDownloadType(document, storage);
};

const detachedInitModal = async () => {
  const {default: initModal} = await import('./modal.js');
  initModal(document, domUtils);
};

const detachedInitLayout = async () => {
  const {default: initLayout} = await import('./layout.js');
  initLayout(document, storage);
};

const detachedInitLanguageSelector = async () => {
  const {default: initLanguageSelector} = await import(
    './language-selector.js'
  );
  initLanguageSelector(document, domUtils);
};

(() => {
  detachedInitIntersectionObserver();
  detachedInitColorScheme();
  detachedInitCopyButtons();
  detachedInitSearch();

  if (!window.__TEST_ENV__) {
    detachedInitFilters();
  }

  detachedInitDownloadType();
  detachedInitModal();
  detachedInitLayout();
  detachedInitLanguageSelector();
})();
