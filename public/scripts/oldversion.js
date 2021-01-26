import { hideElement } from './dom-utils.js';
import { STORAGE_HIDE_TEMP_BANNER } from './storage.js';

export default function initCopyButtons(document, storage) {
  const $infoBanner = document.querySelector('.banner-feedback');
  const $hideInfoButton = document.getElementById('hide-feedback-banner');

  $hideInfoButton.disabled = false;

  const storedHideInfoValue = storage.getItem(STORAGE_HIDE_TEMP_BANNER);
  if (storedHideInfoValue) {
    hideElement($infoBanner);
  }

  $hideInfoButton.addEventListener('click', (event) => {
    event.preventDefault();
    hideElement($infoBanner);
    storage.setItem(STORAGE_HIDE_TEMP_BANNER, true);
  });
}
