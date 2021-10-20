import { STORAGE_KEY_DOWNLOAD_TYPE } from './storage.js';

const PDF_DOWNLOAD_TYPE = 'pdf';
const SVG_DOWNLOAD_TYPE = 'svg';

const DEFAULT_DOWNLOAD_TYPE = SVG_DOWNLOAD_TYPE;

const CLASS_DOWNLOAD_TYPE_SVG = 'download-type-svg';
const CLASS_DOWNLOAD_TYPE_PDF = 'download-type-pdf';

export default function initDownloadType(document, storage) {
  let activeDownloadType = DEFAULT_DOWNLOAD_TYPE;

  const $body = document.querySelector('body');
  const $downloadPdf = document.getElementById('download-type-pdf');
  const $downloadSvg = document.getElementById('download-type-svg');
  const $downloadFiles = document.getElementsByClassName('download-type-file');

  $downloadPdf.disabled = false;
  $downloadSvg.disabled = false;

  if (storage.hasItem(STORAGE_KEY_DOWNLOAD_TYPE)) {
    const storedDownloadType = storage.getItem(STORAGE_KEY_DOWNLOAD_TYPE);
    selectDownloadType(storedDownloadType);
  }

  $downloadPdf.addEventListener('click', (event) => {
    event.preventDefault();
    selectDownloadType(PDF_DOWNLOAD_TYPE);
    $downloadPdf.blur();
  });
  $downloadSvg.addEventListener('click', (event) => {
    event.preventDefault();
    selectDownloadType(SVG_DOWNLOAD_TYPE);
    $downloadSvg.blur();
  });

  for (var i = 0; i < $downloadFiles.length; i++) {
    $downloadFiles[i].addEventListener('click', (event) => {
      const slug = event.target.getAttribute('data-icon');
      const type = storage.getItem(STORAGE_KEY_DOWNLOAD_TYPE);
      event.target.setAttribute('href', `./icons/${slug}.${type}`);
    });
  }

  function selectDownloadType(selected) {
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
