import { STORAGE_KEY_DOWNLOAD_TYPE } from './storage.js';

const PDF_DOWNLOAD_TYPE = 'pdf';
const SVG_DOWNLOAD_TYPE = 'svg';

const DEFAULT_DOWNLOAD_TYPE = SVG_DOWNLOAD_TYPE;

const CLASS_DOWNLOAD_TYPE_SVG = 'download-svg';
const CLASS_DOWNLOAD_TYPE_PDF = 'download-pdf';

export default (document, storage) => {
  let activeDownloadType = DEFAULT_DOWNLOAD_TYPE;

  const $body = document.querySelector('body');
  const $downloadPdf = document.getElementById('download-pdf');
  const $downloadSvg = document.getElementById('download-svg');
  const $downloadFileLinks = document.querySelectorAll(
    '.grid-item__footer button:nth-child(3)',
  );

  $downloadPdf.disabled = false;
  $downloadSvg.disabled = false;

  const selectDownloadType = (selected) => {
    if (selected === activeDownloadType) {
      return;
    }

    if (selected === SVG_DOWNLOAD_TYPE) {
      $body.classList.replace(CLASS_DOWNLOAD_TYPE_PDF, CLASS_DOWNLOAD_TYPE_SVG);
    } else if (selected === PDF_DOWNLOAD_TYPE) {
      $body.classList.replace(CLASS_DOWNLOAD_TYPE_SVG, CLASS_DOWNLOAD_TYPE_PDF);
    }

    storage.setItem(STORAGE_KEY_DOWNLOAD_TYPE, selected);
    activeDownloadType = selected;
  };

  if (storage.hasItem(STORAGE_KEY_DOWNLOAD_TYPE)) {
    const storedDownloadType = storage.getItem(STORAGE_KEY_DOWNLOAD_TYPE);
    selectDownloadType(storedDownloadType);
  } else {
    storage.setItem(STORAGE_KEY_DOWNLOAD_TYPE, DEFAULT_DOWNLOAD_TYPE);
  }

  $downloadPdf.addEventListener('click', () => {
    selectDownloadType(PDF_DOWNLOAD_TYPE);
  });
  $downloadSvg.addEventListener('click', () => {
    selectDownloadType(SVG_DOWNLOAD_TYPE);
  });

  const downloadFile = (event) => {
    const $preview =
      event.target.parentNode.parentNode.querySelector('.icon-preview');
    event.preventDefault();
    const downloadType = storage.getItem(STORAGE_KEY_DOWNLOAD_TYPE);

    let href = $preview.getAttribute('src');
    if (downloadType === 'pdf') {
      href = href.replace('.svg', '.pdf');
    }

    const a = document.createElement('a');
    a.style.display = 'none';
    a.setAttribute('href', href);
    a.setAttribute('download', '');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  for (let i = 0; i < $downloadFileLinks.length; i++) {
    $downloadFileLinks[i].addEventListener('click', downloadFile);
  }
};
