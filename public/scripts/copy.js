const COPIED_TIMEOUT = 1000;

function setCopied($el) {
  $el.classList.add('copied');
  setTimeout(() => $el.classList.remove('copied'), COPIED_TIMEOUT);
}

export default function initCopyButtons(
  document,
  navigator,
) {
  const $copyInput = document.getElementById('copy-input');
  const $colorButtons = document.querySelectorAll('.grid-item__color');
  const $svgButtons = document.querySelectorAll('.grid-item__preview');

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

      const $svg = $svgButton.parentNode.querySelector('svg');
      const value = $svg.outerHTML;
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
};
