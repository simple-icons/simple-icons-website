const COPIED_TIMEOUT = 1000;

function setCopied($el) {
  $el.classList.add('copied');
  setTimeout(() => $el.classList.remove('copied'), COPIED_TIMEOUT);
}

export default function initCopyButtons(document, navigator, fetch) {
  function copyValue(value) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
    } else {
      $copyInput.value = value;
      $copyInput.select();
      document.execCommand('copy');
    }
  }

  function onClickColorButton(event) {
    event.preventDefault();
    copyValue(event.target.innerHTML);
    setCopied(event.target);
  }

  async function onClickSvgButton(event) {
    event.preventDefault();

    const $img = event.target.querySelector('img');
    const iconUrl = $img.getAttribute('src');

    try {
      const data = await fetch(iconUrl);
      const svgValue = await data.text();
      copyValue(svgValue);
      setCopied(event.target);
    } catch (err) {
      console.error(err);
    }
  }

  const $copyInput = document.getElementById('copy-input');
  const $colorButtons = document.querySelectorAll('.copy-color');
  const $svgButtons = document.querySelectorAll('.copy-svg');

  $colorButtons.forEach(($colorButton) => {
    $colorButton.removeAttribute('disabled');
    $colorButton.addEventListener('click', onClickColorButton);
  });

  $svgButtons.forEach(($svgButton) => {
    $svgButton.removeAttribute('disabled');
    $svgButton.addEventListener('click', onClickSvgButton);
  });
}
