const COPIED_TIMEOUT = 1000;

function setCopied($el) {
  $el.classList.add('copied');
  setTimeout(() => $el.classList.remove('copied'), COPIED_TIMEOUT);
}

export default function initCopyButtons(document, navigator, fetch) {
  const $copyInput = document.getElementById('copy-input');
  const $colorButtons = document.querySelectorAll('.copy-color');
  const $svgButtons = document.querySelectorAll('.copy-svg');

  $colorButtons.forEach(($colorButton) => {
    $colorButton.removeAttribute('disabled');
    $colorButton.addEventListener('click', (event) => {
      event.preventDefault();

      const value = $colorButton.innerHTML;
      copyValue(value);
      setCopied($colorButton);
    });
  });

  $svgButtons.forEach(($svgButton) => {
    $svgButton.removeAttribute('disabled');
    $svgButton.addEventListener('click', async (event) => {
      event.preventDefault();

      const $img = $svgButton.querySelector('img');
      const iconUrl = $img.getAttribute('src');

      try {
        const data = await fetch(iconUrl);
        const svgValue = await data.text();
        copyValue(svgValue);
        setCopied($svgButton);
      } catch (err) {
        console.error(err);
      }
    });
  });

  function copyValue(value) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
    } else {
      $copyInput.value = value;
      $copyInput.select();
      document.execCommand('copy');
    }
  }
}
