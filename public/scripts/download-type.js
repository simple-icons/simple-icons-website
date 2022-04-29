import { STORAGE_KEY_DOWNLOAD_TYPE } from './storage.js';
import { iconHrefToSlug } from './utils.js';

const PDF_DOWNLOAD_TYPE = 'pdf';
const SVG_DOWNLOAD_TYPE = 'svg';

const DEFAULT_DOWNLOAD_TYPE = SVG_DOWNLOAD_TYPE;

const CLASS_DOWNLOAD_TYPE_SVG = 'download-svg';
const CLASS_DOWNLOAD_TYPE_PDF = 'download-pdf';

export default initDownloadType = (document, storage) => {
  let activeDownloadType = DEFAULT_DOWNLOAD_TYPE;

  const $body = document.querySelector('body');
  const $downloadPdf = document.getElementById('download-pdf');
  const $downloadSvg = document.getElementById('download-svg');
  const $downloadFiles = document.getElementsByClassName('grid-item__button');

  $downloadPdf.disabled = false;
  $downloadSvg.disabled = false;

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

  for (let i = 0; i < $downloadFiles.length; i++) {
    $downloadFiles[i].addEventListener('click', (event) => {
      const slug = iconHrefToSlug(event.target.getAttribute('href'));
      const type = storage.getItem(STORAGE_KEY_DOWNLOAD_TYPE);
      event.target.setAttribute('href', `./icons/${slug}.${type}`);
    });
  }

  const selectDownloadType = (selected) => {
    if (selected === activeDownloadType) {
      return;
    }

    if (selected === SVG_DOWNLOAD_TYPE) {
      $body.classList.add(CLASS_DOWNLOAD_TYPE_SVG);
      $body.classList.remove(CLASS_DOWNLOAD_TYPE_PDF);
    } else if (selected === PDF_DOWNLOAD_TYPE) {
      $body.classList.add(CLASS_DOWNLOAD_TYPE_PDF);
      $body.classList.remove(CLASS_DOWNLOAD_TYPE_SVG);
    }

    storage.setItem(STORAGE_KEY_DOWNLOAD_TYPE, selected);
    activeDownloadType = selected;
  }
}
