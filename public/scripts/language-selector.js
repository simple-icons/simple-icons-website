const initLanguageSelector = (document, domUtils) => {
  const $languageSelector = document.querySelector('#language-selector');
  const $languageSelectorList = $languageSelector.querySelector('ul');

  $languageSelector.addEventListener('click', (event) => {
    domUtils.toggleVisibleElement($languageSelectorList);
    event.stopPropagation();
  });

  document.addEventListener('click', (event) => {
    const composedPath = event.composedPath();
    if (!composedPath.includes($languageSelector)) {
      domUtils.hideElement($languageSelectorList);
    }
  });
};

export default initLanguageSelector;
