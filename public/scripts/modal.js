import getRelativeLuminance from 'get-relative-luminance';

let DETAILS_MODAL_OPENED = false;

export default (document, domUtils, iconsData) => {
  const $popupModalTrigger = document.querySelector('.popup-trigger');
  const $popupModal = document.querySelector('.popup_modal');
  const $popupBody = document.querySelector('.popup-body');

  // Detail view
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
    const $iconImage = $iconGridItem.children[0].children[0].children[0];
    const filename = $iconImage.getAttribute('src').split('/').pop();
    const slug = filename.substring(0, filename.length - 4);
    const icon = iconsData.getIconData(slug);

    if (!DETAILS_MODAL_OPENED) {
      domUtils.toggleVisibleElement($detailModal);
    }

    const luminance = getRelativeLuminance.default(`#${icon.hex}`);
    const $hexContainer = $detailBody.querySelector('#icon-color');

    $hexContainer.setAttribute(
      'style',
      `background-color: #${icon.hex}; color: #${
        luminance < 0.4 ? 'eee' : '222'
      }`,
    );
    $hexContainer.innerText = `#${icon.hex}`;
    $detailBody.querySelector('img#icon-preview').src = $iconImage.src;
    $detailBody.querySelector('#icon-title').innerText = icon.title;
    $detailBody.querySelector('#icon-source').setAttribute('href', icon.source);

    const $iconGuidelines = $detailBody.querySelector(
      '.icon-guidelines#guidelines',
    );
    const $iconGuidelinesNoGuidelines = $detailBody.querySelector(
      '.icon-guidelines#no-guidelines',
    );
    if (icon.guidelines) {
      $iconGuidelines.style.display = '';
      $iconGuidelinesNoGuidelines.style.display = 'none';
      $iconGuidelines.setAttribute('href', icon.guidelines);
    } else {
      $iconGuidelines.style.display = 'none';
      $iconGuidelinesNoGuidelines.style.display = '';
    }

    const $iconLicense = $detailBody.querySelector('.icon-license#license');
    const $iconLicenseNoLicense = $detailBody.querySelector(
      '.icon-license#no-license',
    );
    if (icon.license) {
      $iconLicense.style.display = '';
      $iconLicenseNoLicense.style.display = 'none';
      $iconLicense.setAttribute('href', icon.license.url);
      $iconLicense.innerText = icon.license.type;
    } else {
      $iconLicense.style.display = 'none';
      $iconLicenseNoLicense.style.display = '';
    }

    const $iconDeprecated = $detailBody.querySelector('#icon-deprecated');
    const $iconDeprecatedMessage = $iconDeprecated.children[1];

    if ($iconGridItem.hasAttribute('deprecated')) {
      const deprecatedAt = JSON.parse($iconGridItem.getAttribute('deprecated'));
      $iconDeprecated.style.display = '';
      $iconDeprecatedMessage.setAttribute(
        'href',
        `https://github.com/simple-icons/simple-icons/milestone/${deprecatedAt.milestoneNumber}`,
      );
      $iconDeprecatedMessage.innerText = $iconDeprecatedMessage
        .getAttribute('removal-msg-schema')
        .replace('$version', deprecatedAt.version);
    } else {
      $iconDeprecated.style.display = 'none';
      $iconDeprecatedMessage.removeAttribute('href');
      $iconDeprecatedMessage.innerText = '';
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
