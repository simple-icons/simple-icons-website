const PDFDocument = require('./pdfkit.standalone');
const SVGtoPDF = require('./svg-to-pdfkit');
const blobStream = require('./blob-stream');
async function generatePDF(slug, svgString, $pdfButton) {
  // Create a fake CreationDate for PDFs that results in an empty string. This
  // prevents changes to the PDF if the corresponding SVG didn't change.
  const CreationData = new String('');
  CreationData.getTime = () => '';

  let doc = new PDFDocument({
    size: [24, 24],
    Title: slug,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    info: {
      CreationDate: CreationData,
    },
  });
  const stream = doc.pipe(blobStream());
  SVGtoPDF(doc, svgString, 0, 0);
  doc.end();
  await stream.on('finish', function () {
    const url = stream.toBlobURL('application/pdf');
    $pdfButton.setAttribute('href', url);
    $pdfButton.click();
  });

  console.log($pdfButton.getAttribute('href'));
  return stream;
}

export default function initPDFGeneration(window, document) {
  const $cards = document.querySelectorAll('.grid-item');

  $cards.forEach(($card) => {
    const $svgButton = $card.querySelector('.copy-svg');
    const $img = $svgButton.querySelector('img');
    const srcValue = $img.getAttribute('src');
    const base64Svg = srcValue.replace('data:image/svg+xml;base64,', '');
    const svgString = window.atob(base64Svg);

    const $pdfButton = $card.querySelector('.pdf-download');
    $pdfButton.removeAttribute('disabled');
    $pdfButton.addEventListener('click', async (event) => {
      if ($pdfButton.getAttribute('href') === '#') {
        event.preventDefault();

        const slug = $pdfButton.getAttribute('data-slug');
        return await generatePDF(slug, svgString, $pdfButton);
      }
    });
  });
}
