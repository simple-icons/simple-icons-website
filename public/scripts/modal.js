import * as simpleIcons from 'simple-icons/icons';
import getRelativeLuminance from 'get-relative-luminance';

const icons = Object.values(simpleIcons).sort((icon1, icon2) =>
  icon1.title.localeCompare(icon2.title),
);

export default (document, domUtils) => {
  const $modalTrigger = document.querySelector('.popup-trigger');
  const $popupModal = document.querySelector('.popup_modal');
  const $popupBody = document.querySelector('.popup-body');
  $modalTrigger.addEventListener('click', (e) => {
    domUtils.toggleVisibleElement($popupModal);
    e.stopPropagation();
  });

  // Detail view
  const $detailButtons = document.querySelectorAll('.view-button');
  const $detailModal = document.querySelector('.detail_modal');
  const $detailBody = document.querySelector('.detail-body');
  const $detailFooter = document.querySelector('.detail-footer');
  $detailButtons.forEach((button) =>
    button.addEventListener('click', (e) => {
      domUtils.toggleVisibleElement($detailModal);
      const index = e.target.getAttribute('index');
      const icon = icons[index];
      const luminance = getRelativeLuminance(`#${icon.hex}`);

      const $iconHex = $detailBody.querySelector('#icon-hex');
      domUtils.removeClasses(
        $iconHex,
        'contrast-light',
        'contrast-dark',
        'border-light',
        'border-dark',
      );
      domUtils.addClass(
        $iconHex,
        luminance < 0.4 ? 'contrast-light' : 'contrast-dark',
      );
      if (luminance > 0.95) domUtils.addClass($iconHex, 'border-light');
      if (luminance < 0.02) domUtils.addClass($iconHex, 'border-dark');
      $detailBody
        .querySelector('#icon-hex')
        .setAttribute('style', `background-color: #${icon.hex}`);
      $iconHex.innerHTML = icon.hex;
      $detailBody.querySelector('#icon_container').innerHTML = icon.svg;
      $detailBody.querySelector('#icon-title').innerHTML = icon.title;

      $detailBody
        .querySelector('#icon-source')
        .setAttribute('href', icon.source);
      $detailBody.querySelector('#icon-source').innerHTML = icon.source.slice(
        0,
        25,
      );

      if (icon.guidelines) {
        $detailBody.querySelector('#icon-guidelines').innerHTML = 'Guidelines';
        domUtils.removeClass(
          $detailBody.querySelector('#icon-guidelines'),
          'italic-text',
        );
        $detailBody
          .querySelector('#icon-guidelines')
          .setAttribute('href', icon.guidelines);
      } else {
        domUtils.addClass(
          $detailBody.querySelector('#icon-guidelines'),
          'italic-text',
        );
        $detailBody.querySelector('#icon-guidelines').innerHTML =
          'no guidelines';
      }

      if (icon.license) {
        $detailBody
          .querySelector('#icon-license')
          .setAttribute('href', icon.license.url);
        domUtils.removeClass(
          $detailBody.querySelector('#icon-license'),
          'italic-text',
        );
        $detailBody.querySelector('#icon-license').innerHTML =
          icon.license.type;
      } else {
        domUtils.addClass(
          $detailBody.querySelector('#icon-license'),
          'italic-text',
        );
        $detailBody.querySelector('#icon-license').innerHTML = 'no license';
      }

      const iconSVG = icon.svg.replace('svg', `svg fill="%23${icon.hex}"`);
      const colorSVG = `data:image/svg+xml,${iconSVG}`;

      $detailFooter
        .querySelector('#icon-download-svg')
        .setAttribute('href', `./icons/${icon.slug}.svg`);
      $detailFooter
        .querySelector('#icon-download-color-svg')
        .setAttribute('href', colorSVG);
      $detailFooter
        .querySelector('#icon-download-pdf')
        .setAttribute('href', `./icons/${icon.slug}.pdf`);
      $detailFooter
        .querySelector('#icon-report')
        .setAttribute(
          'href',
          `https://github.com/simple-icons/simple-icons/issues/new?labels=icon+outdated&template=icon_update.md&title=Update%20${icon.title}%20icon`,
        );
      e.stopPropagation();
    }),
  );

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      domUtils.hideElement($popupModal);
      domUtils.hideElement($detailModal);
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.composedPath().includes($popupBody)) {
      domUtils.hideElement($popupModal);
    }
    if (!e.composedPath().includes($detailModal)) {
      domUtils.hideElement($detailModal);
    }
  });
};
