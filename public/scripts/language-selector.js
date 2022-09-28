const initLanguageSelector = (document, domUtils) => {
  const $languageSelector = document.querySelector('#language-selector');
  const $languageSelectorList = $languageSelector.querySelector('ul');

  $languageSelector.addEventListener('click', (e) => {
    domUtils.toggleVisibleElement($languageSelectorList);
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    const composedPath = e.composedPath();
    if (!composedPath.includes($languageSelector)) {
      domUtils.hideElement($languageSelectorList);
    }
  });
};

export default initLanguageSelector;
