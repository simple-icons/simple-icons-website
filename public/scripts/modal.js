import fetch from 'node-fetch';

export default async function initModal(document, domUtils) {
  const response = await fetch(
    'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/README.md',
  );
  const body = await response.text();

  console.log(body);

  const $modalTrigger = document.querySelector('.popup-trigger');
  const $modalCloseTrigger = document.querySelector('.popup__close');
  const $popupModal = document.querySelector('.popup_modal');
  $modalTrigger.addEventListener('click', () => {
    domUtils.showElement($popupModal);
  });

  $modalCloseTrigger.addEventListener('click', () => {
    domUtils.hideElement($popupModal);
  });
}
