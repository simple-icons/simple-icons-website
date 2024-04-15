import {STORAGE_KEY_LAYOUT} from './storage.js';

const LAYOUT_COMPACT = 'layout-compact';
const LAYOUT_COMFORTABLE = 'layout-comfortable';

const DEFAULT_LAYOUT = LAYOUT_COMFORTABLE;

const initLayout = (document, storage) => {
  let activelayout = DEFAULT_LAYOUT;

  const $body = document.querySelector('body');
  const $layoutComfortable = document.querySelector('#layout-comfortable');
  const $layoutCompact = document.querySelector('#layout-compact');

  function selectlayout(selected) {
    if (selected === activelayout) {
      return;
    }

    if (selected === LAYOUT_COMFORTABLE) {
      $body.classList.replace(LAYOUT_COMPACT, LAYOUT_COMFORTABLE);
    } else if (selected === LAYOUT_COMPACT) {
      $body.classList.replace(LAYOUT_COMFORTABLE, LAYOUT_COMPACT);
    } else {
      selected = DEFAULT_LAYOUT;
      $body.classList.remove(LAYOUT_COMFORTABLE, LAYOUT_COMPACT);
      $body.classList.add(DEFAULT_LAYOUT);
    }

    storage.setItem(STORAGE_KEY_LAYOUT, selected);
    activelayout = selected;
  }

  const storedlayout = storage.getItem(STORAGE_KEY_LAYOUT);
  selectlayout(storedlayout);

  $layoutComfortable.addEventListener('click', (event) => {
    event.preventDefault();
    selectlayout(LAYOUT_COMFORTABLE);
  });
  $layoutCompact.addEventListener('click', (event) => {
    event.preventDefault();
    selectlayout(LAYOUT_COMPACT);
  });

  $layoutComfortable.disabled = false;
  $layoutCompact.disabled = false;
};

export default initLayout;
