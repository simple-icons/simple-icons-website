export default async function initMenu(document, domUtils) {
  document
    .querySelector('#menu-Toggle svg')
    .addEventListener('click', (e) =>
      domUtils.toggleClass(document.querySelector('#menu'), 'hidden-768'),
    );
}
