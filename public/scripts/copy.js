import {iconHrefToSlug} from './utils.js';

const COPIED_TIMEOUT = 1000;

const setCopied = ($element) => {
  $element.classList.add('copied');
  setTimeout(() => $element.classList.remove('copied'), COPIED_TIMEOUT);
};

export default function copy(document, navigator, fetch) {
  const $copyInput = document.querySelector('#copy-input');
  const $colorButtons = document.querySelectorAll('.copy-color');
  const $svgButtons = document.querySelectorAll('.copy-svg');
  const $slugButtons = document.querySelectorAll('.copy-slug');

  const copyValue = (value) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
    } else {
      $copyInput.value = value;
      $copyInput.select();
      document.execCommand('copy');
    }
  };

  const onClickColorButton = (event) => {
    event.preventDefault();
    copyValue(event.target.innerHTML);
    setCopied(event.target);
  };

  const onClickSvgButton = async (event) => {
    event.preventDefault();

    const $img = event.target.querySelector('img');
    const iconUrl = $img.getAttribute('src');

    try {
      const data = await fetch(iconUrl);
      const svgValue = await data.text();
      copyValue(svgValue);
      setCopied(event.target);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickSlugButton = (event) => {
    event.preventDefault();
    const href = event.target.parentNode.parentNode
      .querySelector('.icon-preview')
      .getAttribute('src');
    const slug = iconHrefToSlug(href);
    copyValue(slug);
    setCopied(event.target);
  };

  for (const $colorButton of $colorButtons) {
    $colorButton.removeAttribute('disabled');
    $colorButton.addEventListener('click', onClickColorButton);
  }

  for (const $svgButton of $svgButtons) {
    $svgButton.removeAttribute('disabled');
    $svgButton.addEventListener('click', onClickSvgButton);
  }

  for (const $slugButton of $slugButtons) {
    $slugButton.removeAttribute('disabled');
    $slugButton.addEventListener('click', onClickSlugButton);
  }
}
