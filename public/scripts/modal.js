export default async function initModal(document, domUtils) {
  const $modalTrigger = document.querySelector('.popup-trigger');
  const $popupModal = document.querySelector('.popup_modal');
  $modalTrigger.addEventListener('click', (e) => {
    domUtils.toggleVisibleElement($popupModal);
    e.stopPropagation();
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      domUtils.hideElement($popupModal);
    }
  });

  document.body.addEventListener('click', (e) => {
    domUtils.hideElement($popupModal);
  });
}
