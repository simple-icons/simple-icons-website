import getRelativeLuminance from 'get-relative-luminance';
import {downloadPDF, downloadSVG} from './download-type.js';
import {iconHrefToSlug} from './utils.js';

let DETAILS_MODAL_OPENED = false;

export default function modal(document, domUtils) {
  // Third party extensions popup
  const $popupModalTrigger = document.querySelector('.popup-trigger');
  const $popupModal = document.querySelector('.popup_modal');
  const $popupBody = document.querySelector('.popup-body');

  // Icon details view modal
  const $detailButtons = document.querySelectorAll('.view-button');
  const $detailModal = document.querySelector('.detail_modal');
  const $detailBody = document.querySelector('.detail-body');
  const $detailFooter = document.querySelector('.detail-footer');

  $popupModalTrigger.addEventListener('click', (event) => {
    domUtils.toggleVisibleElement($popupModal);
    event.stopPropagation();
    domUtils.hideElement($detailModal);
    DETAILS_MODAL_OPENED = false;
  });

  const onClickDetailButton = (event) => {
    domUtils.hideElement($popupModal);

    const $iconGridItem = event.target.closest('.grid-item');
    const $iconImage = $iconGridItem.querySelector('img.icon-preview');
    const source = $iconImage.getAttribute('src');
    const iconSlug = iconHrefToSlug(source);
    const iconTitle = $iconGridItem.querySelector('h2').textContent;
    const iconSource = $iconGridItem.getAttribute('s');
    const iconDeprecatedAt = $iconGridItem.getAttribute('d');
    const iconGuidelines = $iconGridItem.getAttribute('g');
    const iconLicenseType = $iconGridItem.getAttribute('lt');
    const iconLicenseUrl = $iconGridItem.getAttribute('lu');
    const iconCssHex =
      $iconGridItem.querySelector('.grid-item__color').textContent;

    if (!DETAILS_MODAL_OPENED) {
      domUtils.showElement($detailModal);
    }

    const luminance = getRelativeLuminance.default(iconCssHex);
    const $hexContainer = $detailBody.querySelector('#icon-color');

    $hexContainer.setAttribute(
      'style',
      `background: ${iconCssHex};` +
        `color: #${luminance < 0.4 ? 'eee' : '222'}`,
    );
    $hexContainer.textContent = iconCssHex;
    $detailBody
      .querySelector('.detail_modal img.icon-preview')
      .setAttribute('src', source);
    $detailBody.querySelector('h2').textContent = iconTitle;
    $detailBody.querySelector('#icon-source').setAttribute('href', iconSource);

    const $iconGuidelines = $detailBody.querySelector(
      '.icon-guidelines#guidelines',
    );
    const $iconGuidelinesNoGuidelines = $detailBody.querySelector(
      '.icon-guidelines#no-guidelines',
    );
    if (iconGuidelines === null) {
      domUtils.showElement($iconGuidelinesNoGuidelines);
      domUtils.hideElement($iconGuidelines);
    } else {
      domUtils.showElement($iconGuidelines);
      domUtils.hideElement($iconGuidelinesNoGuidelines);
      $iconGuidelines.setAttribute('href', iconGuidelines);
    }

    const $iconLicense = $detailBody.querySelector('.icon-license#license');
    const $iconLicenseNoLicense = $detailBody.querySelector(
      '.icon-license#no-license',
    );
    if (iconLicenseType === null) {
      domUtils.showElement($iconLicenseNoLicense);
      domUtils.hideElement($iconLicense);
    } else {
      domUtils.showElement($iconLicense);
      domUtils.hideElement($iconLicenseNoLicense);
      $iconLicense.setAttribute('href', iconLicenseUrl);
      $iconLicense.textContent = iconLicenseType;
    }

    const $iconDeprecated = $detailBody.querySelector('#icon-deprecated');
    const $iconDeprecatedMessage = $iconDeprecated.children[1];

    if (iconDeprecatedAt === null) {
      domUtils.hideElement($iconDeprecated);
      $iconDeprecatedMessage.removeAttribute('href');
      $iconDeprecatedMessage.textContent = '';
    } else {
      const deprecatedAt = JSON.parse(iconDeprecatedAt);
      domUtils.showElement($iconDeprecated);
      $iconDeprecatedMessage.setAttribute(
        'href',
        `https://github.com/simple-icons/simple-icons/milestone/${deprecatedAt.milestoneNumber}`,
      );
      $iconDeprecatedMessage.textContent = $iconDeprecatedMessage
        .getAttribute('removal-msg-schema')
        .replace('$version', deprecatedAt.version);
    }

    // Set download links
    $detailFooter
      .querySelector('#icon-download-svg')
      .addEventListener('click', () => downloadSVG(iconSlug));
    $detailFooter
      .querySelector('#icon-download-pdf')
      .addEventListener('click', () => downloadPDF(iconSlug));

    // Get icon content to generate the colored SVG
    fetch(source)
      .then((response) => response.text())
      .then((iconSVG) => {
        const coloredIconSVG = iconSVG.replace(
          'svg',
          `svg fill="${iconCssHex}"`,
        );
        const $iconDownloadColorSVG = $detailFooter.querySelector(
          '#icon-download-color-svg',
        );
        $iconDownloadColorSVG.setAttribute(
          'href',
          `data:image/svg+xml,${encodeURIComponent(coloredIconSVG)}`,
        );
        $iconDownloadColorSVG.setAttribute('download', `${iconSlug}-color.svg`);
      });

    DETAILS_MODAL_OPENED = true;
    event.stopPropagation();
  };

  for (const $detailButton of $detailButtons) {
    $detailButton.addEventListener('click', onClickDetailButton);
  }

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      domUtils.hideElement($popupModal);
      domUtils.hideElement($detailModal);
    }
  });

  document.addEventListener('click', (event) => {
    const composedPath = event.composedPath();
    if (!composedPath.includes($popupBody)) {
      domUtils.hideElement($popupModal);
    }

    if (!composedPath.includes($detailModal)) {
      domUtils.hideElement($detailModal);
      DETAILS_MODAL_OPENED = false;
    }
  });
}
