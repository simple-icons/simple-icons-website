import { hideElement } from './dom-utils.js';
import { STORAGE_KEY_HIDE_TEMP_BANNER } from './storage.js';

export default function initFeedbackRequest(document, storage) {
  const $feedbackBanner = document.querySelector('.banner-feedback');
  const $hideAlwaysButton = document.getElementById('hide-feedback-banner');
  const $hideOnceButton = document.getElementById('hide-feedback-banner-once');

  $hideAlwaysButton.disabled = false;
  $hideOnceButton.disabled = false;

  const storedHideInfoValue = storage.getItem(STORAGE_KEY_HIDE_TEMP_BANNER);
  if (storedHideInfoValue) {
    hideElement($feedbackBanner);
  }

  $hideAlwaysButton.addEventListener('click', (event) => {
    event.preventDefault();
    hideElement($feedbackBanner);
    storage.setItem(STORAGE_KEY_HIDE_TEMP_BANNER, true);
  });
  $hideOnceButton.addEventListener('click', (event) => {
    event.preventDefault();
    hideElement($feedbackBanner);
  });
}
