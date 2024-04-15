import {STORAGE_KEY_DOWNLOAD_TYPE} from './storage.js';
import {iconHrefToSlug} from './utils.js';

const PDF_DOWNLOAD_TYPE = 'pdf';
const SVG_DOWNLOAD_TYPE = 'svg';

const DEFAULT_DOWNLOAD_TYPE = SVG_DOWNLOAD_TYPE;

const CLASS_DOWNLOAD_TYPE_SVG = 'download-svg';
const CLASS_DOWNLOAD_TYPE_PDF = 'download-pdf';

export const downloadSVG = (slug) => {
  const iconSvgUrl = `/icons/${slug}.svg`;
  const a = document.createElement('a');
  a.classList.add('hidden');
  a.setAttribute('href', iconSvgUrl);
  a.setAttribute('download', '');

  document.body.append(a);
  a.click();
  a.remove();
};

export const downloadPDF = async (slug) => {
  const loadPdfKitAndBlobStream = async () => {
    const [pdfkit, blobStream] = await Promise.all([
      import('pdfkit/js/pdfkit.standalone.js'),
      import('blob-stream/.js'),
    ]);
    return [pdfkit.default, blobStream.default];
  };

  const [PDFDocument, blobStream] = await loadPdfKitAndBlobStream();

  const iconSvgUrl = `/icons/${slug}.svg`;
  const response = await fetch(iconSvgUrl);
  const svg = await response.text();
  const svgPath = svg.split('"')[7];

  let document_;
  let stream;
  try {
    document_ = new PDFDocument({size: [24, 24]});
    stream = document_.pipe(blobStream());
    document_.path(svgPath).fill();
  } catch (error) {
    // Some icon paths are not parsed correctly by PDFKit ('/e/' for example)
    // so we catch the error and generate a PDF with the error message
    document_ = new PDFDocument({size: 'A8'});
    stream = document_.pipe(blobStream());
    console.error(error);
    document_.fontSize(12);
    document_.text(
      `Error generating PDF with PDFKit library: ${error.message}`,
      0,
      0,
      {
        align: 'center',
      },
    );
  }

  document_.end();
  stream.on('finish', () => {
    const url = stream.toBlobURL('application/pdf');
    const a = document.createElement('a');
    a.classList.add('hidden');
    a.setAttribute('href', url);
    a.setAttribute('download', `${slug}.pdf`);
    document.body.append(a);
    a.click();
    a.remove();
  });
};

export default function downloadType(document, storage) {
  let activeDownloadType = DEFAULT_DOWNLOAD_TYPE;

  const $body = document.querySelector('body');
  const $downloadPdf = document.querySelector('#download-pdf');
  const $downloadSvg = document.querySelector('#download-svg');
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

  const onClickDownloadFileLink = (event) => {
    event.preventDefault();
    const $preview =
      event.target.parentNode.parentNode.querySelector('.icon-preview');
    const href = $preview.getAttribute('src');
    const slug = iconHrefToSlug(href);
    const downloadType = storage.getItem(STORAGE_KEY_DOWNLOAD_TYPE);

    if (downloadType === 'pdf') {
      downloadPDF(slug);
    } else {
      downloadSVG(slug);
    }
  };

  for (const $downloadFileLink of $downloadFileLinks) {
    $downloadFileLink.addEventListener('click', onClickDownloadFileLink);
  }
}
