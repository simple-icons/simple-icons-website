import { hideElement } from './dom-utils.js';
import { STORAGE_HIDE_INFO_BANNER } from './storage.js';

export default function initCopyButtons(document, storage) {
  const $infoBanner = document.querySelector('.info-oldversion');
  const $hideInfoButton = document.getElementById('hide-oldversion');

  $hideInfoButton.disabled = false;

  const storedHideInfoValue = storage.getItem(STORAGE_HIDE_INFO_BANNER);
  if (storedHideInfoValue) {
    hideElement($infoBanner);
  }

  $hideInfoButton.addEventListener('click', (event) => {
    event.preventDefault();
    hideElement($infoBanner);
    storage.setItem(STORAGE_HIDE_INFO_BANNER, true);
  });
}
