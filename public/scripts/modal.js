export default (document, domUtils) => {
  const $modalTrigger = document.querySelector('.popup-trigger');
  const $popupModal = document.querySelector('.popup_modal');
  const $popupBody = document.querySelector('.popup-body');
  $modalTrigger.addEventListener('click', (e) => {
    domUtils.toggleVisibleElement($popupModal);
    e.stopPropagation();
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      domUtils.hideElement($popupModal);
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.composedPath().includes($popupBody)) {
      domUtils.hideElement($popupModal);
    }
  });
};
