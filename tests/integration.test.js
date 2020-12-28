const path = require('path');
const { URL } = require('url');

const {
  getClipboardValue,
  getValue,
  hasClass,
  isDisabled,
  isHidden,
  isInViewport,
  isVisible,
} = require('./helpers.js');

const COLOR_REGEX = /^#[A-F0-9]{6}$/;
const SVG_REGEX = /^<svg.*>.*<\/svg>$/;

const url = new URL('http://localhost:8080/');

describe('General', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(url.href);
  });

  it('produces a screenshot', async () => {
    await page.screenshot({
      path: path.resolve(ARTIFACTS_DIR, 'desktop.png'),
    });
  });

  it('should display the text "Simple Icons"', async () => {
    await expect(page).toMatch('Simple Icons');
  });

  it('should be possible to click the link to GitHub', async () => {
    await expect(page).toClick('a', { text: 'GitHub' });
  });

  it('should be possible to click the link to NPM', async () => {
    await expect(page).toClick('a', { text: 'NPM' });
  });

  it('should be possible to click the link to Packagist', async () => {
    await expect(page).toClick('a', { text: 'Packagist' });
  });

  it('should be possible to click the about link', async () => {
    await expect(page).toClick('a', { text: 'About' });
  });

  it('should have the search input in view on load', async () => {
    const $searchInput = await page.$('#search-input');
    expect(await isInViewport($searchInput)).toBeTruthy();
  });

  it('should have the order controls in view on load', async () => {
    const $orderAlphabetically = await page.$('#order-alpha');
    expect(await isInViewport($orderAlphabetically)).toBeTruthy();

    const $orderByColor = await page.$('#order-color');
    expect(await isInViewport($orderByColor)).toBeTruthy();
  });

  it('should have the first grid item in view on load', async () => {
    const $firstGridItem = await page.$('.grid-item');
    expect(await isInViewport($firstGridItem)).toBeTruthy();
  });

  afterEach(async () => {
    await page.close();
  });
});

describe('Search', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(url.href);
  });

  it('should not show the "order by relevance" button on load', async () => {
    const $orderByRelevance = await page.$('#order-relevance');
    expect(await isHidden($orderByRelevance)).toBeTruthy();
  });

  it('should not show the "clear search" button on load', async () => {
    const $searchClear = await page.$('#search-clear');
    expect(await isHidden($searchClear)).toBeTruthy();
  });

  it('should show the "order by relevance" button on search', async () => {
    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $orderByRelevance = await page.$('#order-relevance');
    expect(await isVisible($orderByRelevance)).toBeTruthy();
  });

  it('should show the "clear search" button on search', async () => {
    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $searchClear = await page.$('#search-clear');
    expect(await isVisible($searchClear)).toBeTruthy();
  });

  it('should enable ordering by relevance on search', async () => {
    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-by-relevance')).toBeTruthy();
  });

  it('should reset when clicking the "clear search" button', async () => {
    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $searchClear = await page.$('#search-clear');
    await $searchClear.click();

    expect(await getValue($searchInput)).toBe('');
    expect(await isHidden($searchClear)).toBeTruthy();
  });

  it.each([
    ['order-alpha', 'order-alphabetically'],
    ['order-color', 'order-by-color'],
  ])('should switch back to "%s" when search is cleared', async (id, value) => {
    await page.click(`#${id}`);

    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $searchClear = await page.$('#search-clear');
    await $searchClear.click();

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-by-relevance')).toBeFalsy();
    expect(await hasClass($body, value)).toBeTruthy();
  });

  it.each([
    ['order-alpha', 'order-alphabetically'],
    ['order-color', 'order-by-color'],
  ])('should switch back to "%s" when search is removed', async (id, value) => {
    await page.click(`#${id}`);

    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    await $searchInput.click({ clickCount: 3 });
    await $searchInput.press('Backspace');

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-by-relevance')).toBeFalsy();
    expect(await hasClass($body, value)).toBeTruthy();
  });

  it('should add the search query to the URL', async () => {
    const query = 'amd';

    const $searchInput = await page.$('#search-input');
    await $searchInput.type(query, { delay: 100 });

    const url = page.url();
    expect(url).toMatch(`?q=${query}`);
  });

  it('should load the search query from the URL', async () => {
    const query = 'simple icons';
    await page.goto(`${url.href}?q=${query}`);

    const $searchInput = await page.$('#search-input');
    const searchInputValue = await getValue($searchInput);
    expect(searchInputValue).toEqual(query);

    const $searchClear = await page.$('#search-clear');
    expect(await isVisible($searchClear)).toBeTruthy();

    const $orderByRelevance = await page.$('#order-relevance');
    expect(await isVisible($orderByRelevance)).toBeTruthy();
  });

  afterEach(async () => {
    await page.close();
  });
});

describe('Grid item', () => {
  let page;

  beforeAll(async () => {
    const context = browser.defaultBrowserContext();
    await context._connection.send('Browser.grantPermissions', {
      origin: url.origin,
      permissions: [
        'clipboardReadWrite',
        'clipboardSanitizedWrite',
      ],
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(url.href);
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: ARTIFACTS_DIR,
    });
  });

  it('should have the color value button enabled', async () => {
    const $previewButton = await page.$('button.grid-item__color');
    expect(await isDisabled($previewButton)).toBeFalsy();
  });

  it('should copy the hex value when it is clicked', async () => {
    await expect(page).toClick('button.grid-item__color');
    const clipboardValue = await getClipboardValue(page);
    expect(clipboardValue).toMatch(COLOR_REGEX);
  });

  it('should have the SVG preview button enabled', async () => {
    const $previewButton = await page.$('button.grid-item__preview');
    expect(await isDisabled($previewButton)).toBeFalsy();
  });

  it('should copy the SVG value when the preview is clicked', async () => {
    await expect(page).toClick('button.grid-item__preview');
    const clipboardValue = await getClipboardValue(page);
    expect(clipboardValue).toMatch(SVG_REGEX);
  });

  it('should be possible to download an icon as SVG', async () => {
    await expect(page).toClick('a[download][href$="svg"]');
  });

  it('should be possible to download an icon as PDF', async () => {
    await expect(page).toClick('a[download][href$="pdf"]');
  });

  afterEach(async () => {
    await page.close();
  });
});

describe('JavaScript disabled', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    page.setJavaScriptEnabled(false);
    await page.goto(url.href);
  });

  it('produces a screenshot', async () => {
    await page.screenshot({
      path: path.resolve(ARTIFACTS_DIR, 'js-disabled.png'),
    });
  });

  it('should not show the "order by relevance" button', async () => {
    const $orderByRelevance = await page.$('#order-relevance');
    expect(await isHidden($orderByRelevance)).toBeTruthy();
  });

  it('should not show the "clear search" button on load', async () => {
    const $searchClear = await page.$('#search-clear');
    expect(await isHidden($searchClear)).toBeTruthy();
  });

  it('should have disabled ordering buttons', async () => {
    const $orderAlphabetically = await page.$('#order-alpha');
    expect(await isDisabled($orderAlphabetically)).toBeTruthy();

    const $orderByColor = await page.$('#order-color');
    expect(await isDisabled($orderByColor)).toBeTruthy();

    const $orderByRelevance = await page.$('#order-relevance');
    expect(await isDisabled($orderByRelevance)).toBeTruthy();
  });

  it('should have the color value button disabled', async () => {
    const $colorButton = await page.$('button.grid-item__color');
    expect(await isDisabled($colorButton)).toBeTruthy();
  });

  it('should have the SVG preview button disabled', async () => {
    const $previewButton = await page.$('button.grid-item__preview');
    expect(await isDisabled($previewButton)).toBeTruthy();
  });

  afterEach(async () => {
    await page.close();
  });
});
