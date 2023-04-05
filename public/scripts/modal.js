import getRelativeLuminance from 'get-relative-luminance';
import { iconHrefToSlug } from './utils.js';
import { downloadPDF, downloadSVG } from './download-type.js';

let DETAILS_MODAL_OPENED = false;

export default (document, domUtils) => {
  // Third party extensions popup
  const $popupModalTrigger = document.querySelector('.popup-trigger');
  const $popupModal = document.querySelector('.popup_modal');
  const $popupBody = document.querySelector('.popup-body');

  // Icon details view modal
  const $detailButtons = document.querySelectorAll('.view-button');
  const $detailModal = document.querySelector('.detail_modal');
  const $detailBody = document.querySelector('.detail-body');
  const $detailFooter = document.querySelector('.detail-footer');

  $popupModalTrigger.addEventListener('click', (e) => {
    domUtils.toggleVisibleElement($popupModal);
    e.stopPropagation();
    domUtils.hideElement($detailModal);
    DETAILS_MODAL_OPENED = false;
  });

  const onClickDetailButton = (e) => {
    domUtils.hideElement($popupModal);

    const $iconGridItem = e.target.closest('.grid-item');
    const $iconImage = $iconGridItem.querySelector('img.icon-preview');
    const src = $iconImage.getAttribute('src');
    const iconSlug = iconHrefToSlug(src);
    const iconTitle = $iconGridItem.querySelector('h2').innerText;
    const iconSource = $iconGridItem.getAttribute('s');
    const iconDeprecatedAt = $iconGridItem.getAttribute('d');
    const iconGuidelines = $iconGridItem.getAttribute('g');
    const iconLicenseType = $iconGridItem.getAttribute('lt');
    const iconLicenseUrl = $iconGridItem.getAttribute('lu');
    const iconCssHex =
      $iconGridItem.querySelector('.grid-item__color').innerText;

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
    $hexContainer.innerText = iconCssHex;
    $detailBody
      .querySelector('.detail_modal img.icon-preview')
      .setAttribute('src', src);
    $detailBody.querySelector('h2').innerText = iconTitle;
    $detailBody.querySelector('#icon-source').setAttribute('href', iconSource);

    const $iconGuidelines = $detailBody.querySelector(
      '.icon-guidelines#guidelines',
    );
    const $iconGuidelinesNoGuidelines = $detailBody.querySelector(
      '.icon-guidelines#no-guidelines',
    );
    if (iconGuidelines !== null) {
      domUtils.showElement($iconGuidelines);
      domUtils.hideElement($iconGuidelinesNoGuidelines);
      $iconGuidelines.setAttribute('href', iconGuidelines);
    } else {
      domUtils.showElement($iconGuidelinesNoGuidelines);
      domUtils.hideElement($iconGuidelines);
    }

    const $iconLicense = $detailBody.querySelector('.icon-license#license');
    const $iconLicenseNoLicense = $detailBody.querySelector(
      '.icon-license#no-license',
    );
    if (iconLicenseType !== null) {
      domUtils.showElement($iconLicense);
      domUtils.hideElement($iconLicenseNoLicense);
      $iconLicense.setAttribute('href', iconLicenseUrl);
      $iconLicense.innerText = iconLicenseType;
    } else {
      domUtils.showElement($iconLicenseNoLicense);
      domUtils.hideElement($iconLicense);
    }

    const $iconDeprecated = $detailBody.querySelector('#icon-deprecated');
    const $iconDeprecatedMessage = $iconDeprecated.children[1];

    if (iconDeprecatedAt !== null) {
      const deprecatedAt = JSON.parse(iconDeprecatedAt);
      domUtils.showElement($iconDeprecated);
      $iconDeprecatedMessage.setAttribute(
        'href',
        `https://github.com/simple-icons/simple-icons/milestone/${deprecatedAt.milestoneNumber}`,
      );
      $iconDeprecatedMessage.innerText = $iconDeprecatedMessage
        .getAttribute('removal-msg-schema')
        .replace('$version', deprecatedAt.version);
    } else {
      domUtils.hideElement($iconDeprecated);
      $iconDeprecatedMessage.removeAttribute('href');
      $iconDeprecatedMessage.innerText = '';
    }

    // Set download links
    $detailFooter
      .querySelector('#icon-download-svg')
      .addEventListener('click', () => downloadSVG(iconSlug));
    $detailFooter
      .querySelector('#icon-download-pdf')
      .addEventListener('click', () => downloadPDF(iconSlug));

    // Get icon content to generate the colored SVG
    fetch(src)
      .then((res) => res.text())
      .then((iconSVG) => {
        const coloredIconSVG = iconSVG.replace(
          'svg',
          `svg fill="%23${iconCssHex.replace('#', '')}"`,
        );
        const $iconDownloadColorSVG = $detailFooter.querySelector(
          '#icon-download-color-svg',
        );
        $iconDownloadColorSVG.setAttribute(
          'href',
          `data:image/svg+xml,${coloredIconSVG}`,
        );
        $iconDownloadColorSVG.setAttribute('download', `${iconSlug}-color.svg`);
      });

    DETAILS_MODAL_OPENED = true;
    e.stopPropagation();
  };

  for (const $detailButton of $detailButtons) {
    $detailButton.addEventListener('click', onClickDetailButton);
  }

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      domUtils.hideElement($popupModal);
      domUtils.hideElement($detailModal);
    }
  });

  document.addEventListener('click', (e) => {
    const composedPath = e.composedPath();
    if (!composedPath.includes($popupBody)) {
      domUtils.hideElement($popupModal);
    }
    if (!composedPath.includes($detailModal)) {
      domUtils.hideElement($detailModal);
      DETAILS_MODAL_OPENED = false;
    }
  });
};
