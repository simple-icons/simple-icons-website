const COPIED_TIMEOUT = 1000;

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

      const target = $colorButton;
      const value = target.innerHTML;
      target.blur();
      copyValue(value);

      target.classList.add('copied');
      setTimeout(() => target.classList.remove('copied'), COPIED_TIMEOUT);
    });
  });

  $svgButtons.forEach(($svgButton) => {
    $svgButton.removeAttribute('disabled');
    $svgButton.addEventListener('click', (event) => {
      event.preventDefault();

      const target = $svgButton;
      const $svg = target.parentNode.querySelector('svg');
      const value = $svg.outerHTML;
      target.blur();
      copyValue(value);

      target.classList.add('copied');
      setTimeout(() => target.classList.remove('copied'), COPIED_TIMEOUT);
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
