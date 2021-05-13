const COPIED_TIMEOUT = 1000;

function setCopied($el) {
  $el.classList.add('copied');
  setTimeout(() => $el.classList.remove('copied'), COPIED_TIMEOUT);
}

export default function initCopyButtons(window, document, navigator) {
  const $copyInput = document.getElementById('copy-input');
  const $colorButtons = document.querySelectorAll('.copy-color');
  const $svgButtons = document.querySelectorAll('.copy-svg');

  $colorButtons.forEach(($colorButton) => {
    $colorButton.removeAttribute('disabled');
    $colorButton.addEventListener('click', (event) => {
      event.preventDefault();

      const value = $colorButton.innerHTML;
      $colorButton.blur();
      copyValue(value);
      setCopied($colorButton);
    });
  });

  $svgButtons.forEach(($svgButton) => {
    $svgButton.removeAttribute('disabled');
    $svgButton.addEventListener('click', (event) => {
      event.preventDefault();

      const $img = $svgButton.querySelector('img');
      const srcValue = $img.getAttribute('src');
      const base64Svg = srcValue.replace('data:image/svg+xml;base64,', '');

      const value = window.atob(base64Svg);
      $svgButton.blur();
      copyValue(value);
      setCopied($svgButton);
    });
  });

  function copyValue(value) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
    } else {
      $copyInput.value = value;
      $copyInput.select();
      document.execCommand('copy');
      $copyInput.blur();
    }
  }
}
