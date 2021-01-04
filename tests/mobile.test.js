const path = require('path');
const puppeteer = require('puppeteer');
const { URL } = require('url');

const {
  isHidden,
  isInViewport,
} = require('./helpers.js');

jest.setTimeout(10000);

const SUITE_PREFIX = 'mobile';

const url = new URL('http://localhost:8080/');
const mobileDevice = puppeteer.devices['Nexus 7'];

describe('General', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.emulate(mobileDevice);
    await page.goto(url.href);
  });

  it('produces a screenshot', async () => {
    await page.screenshot({
      path: path.resolve(ARTIFACTS_DIR, `${SUITE_PREFIX}.png`),
    });
  });

  it('displays the text "Simple Icons"', async () => {
    await expect(page).toMatch('Simple Icons');
  });

  it('is possible to click the link to GitHub', async () => {
    await expect(page).toClick('a', { text: 'GitHub' });
  });

  it('is possible to click the link to NPM', async () => {
    await expect(page).toClick('a', { text: 'NPM' });
  });

  it('is possible to click the link to Packagist', async () => {
    await expect(page).toClick('a', { text: 'Packagist' });
  });

  it('is possible to click the about link', async () => {
    await expect(page).toClick('a', { text: 'About' });
  });

  it('has the search input in view on load', async () => {
    const $searchInput = await page.$('#search-input');
    expect(await isInViewport($searchInput)).toBeTruthy();
  });

  it('has the first grid item in view on load', async () => {
    const $firstGridItem = await page.$('.grid-item');
    expect(await isInViewport($firstGridItem)).toBeTruthy();
  });

  it('hides the #copy-input element', async () => {
    const $copyInput = await page.$('#copy-input');
    expect(await isHidden($copyInput)).toBeTruthy();
  });

  afterEach(async () => {
    await page.close();
  });
});

describe('Preferred color scheme', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.emulate(mobileDevice);
    await page.goto(url.href);
  });

  it.each([
    ['dark', 'rgb(34, 34, 34)'],
    ['light', 'rgb(252, 252, 252)'],
  ])('has color scheme "%s"', async (scheme, expected) => {
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: scheme },
    ]);

    await page.screenshot({
      path: path.resolve(ARTIFACTS_DIR, `${SUITE_PREFIX}_${scheme}-mode.png`),
    });

    const bodyBackgroundColor = await page.evaluate(() => {
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      return bgColor;
    });
    expect(bodyBackgroundColor).toEqual(expected);
  });

  afterEach(async () => {
    await page.close();
  });
});
