import { STORAGE_KEY_DOWNLOAD_TYPE } from './storage.js';
import { iconHrefToSlug } from './utils.js';

const PDF_DOWNLOAD_TYPE = 'pdf';
const SVG_DOWNLOAD_TYPE = 'svg';

const DEFAULT_DOWNLOAD_TYPE = SVG_DOWNLOAD_TYPE;

const CLASS_DOWNLOAD_TYPE_SVG = 'download-svg';
const CLASS_DOWNLOAD_TYPE_PDF = 'download-pdf';

export const downloadSVG = (slug) => {
  const icon_svg_url = `/icons/${slug}.svg`;
  const a = document.createElement('a');
  a.classList.add('hidden');
  a.setAttribute('href', icon_svg_url);
  a.setAttribute('download', '');

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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

  const icon_svg_url = `/icons/${slug}.svg`;
  const res = await fetch(icon_svg_url);
  const svg = await res.text();
  const svg_path = svg.split('"')[7];

  let doc;
  let stream;
  try {
    doc = new PDFDocument({ size: [24, 24] });
    stream = doc.pipe(blobStream());
    doc.path(svg_path).fill();
  } catch (e) {
    // Some icon paths are not parsed correctly by PDFKit ('/e/' for example)
    // so we catch the error and generate a PDF with the error message
    doc = new PDFDocument({ size: 'A8' });
    stream = doc.pipe(blobStream());
    console.error(e);
    doc.fontSize(12);
    doc.text(`Error generating PDF with PDFKit library: ${e.message}`, 0, 0, {
      align: 'center',
    });
  }

  doc.end();
  stream.on('finish', () => {
    const url = stream.toBlobURL('application/pdf');
    const a = document.createElement('a');
    a.classList.add('hidden');
    a.setAttribute('href', url);
    a.setAttribute('download', `${slug}.pdf`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};

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

  for (let i = 0; i < $downloadFileLinks.length; i++) {
    $downloadFileLinks[i].addEventListener('click', onClickDownloadFileLink);
  }
};
