export default async function initModal(document, domUtils) {
  const $modalTrigger = document.querySelector('.popup-trigger');
  const $popupModal = document.querySelector('.popup_modal');
  $modalTrigger.addEventListener('click', () => {
    domUtils.toggleVisibleElement($popupModal);
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      domUtils.hideElement($popupModal);
    }
  });
}
