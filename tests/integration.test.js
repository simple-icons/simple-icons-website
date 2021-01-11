const sortColors = require('color-sorter').sortFn;
const path = require('path');
const { devices } = require('puppeteer');
const simpleIcons = require('simple-icons');
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

jest.setTimeout(10000);

const COLOR_REGEX = /^#[A-F0-9]{6}$/;
const SVG_REGEX = /^<svg.*>.*<\/svg>$/;

const url = new URL('http://localhost:8080/');

beforeAll(() => page.close());

describe.each([
  ['desktop', undefined],
  ['mobile', devices['Nexus 7']]
])('General (%s)', (name, device) => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    if (device) {
      await page.emulate(device);
    }
    await page.goto(url.href);
  });

  it('produces a screenshot', async () => {
    await page.screenshot({
      path: path.resolve(ARTIFACTS_DIR, `${name}.png`),
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

  it('has the order controls in view on load', async () => {
    const $orderAlphabetically = await page.$('#order-alpha');
    expect(await isInViewport($orderAlphabetically)).toBeTruthy();

    const $orderByColor = await page.$('#order-color');
    expect(await isInViewport($orderByColor)).toBeTruthy();
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

describe('Search', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(url.href);
  });

  it('does not show the "order by relevance" button on load', async () => {
    const $orderByRelevance = await page.$('#order-relevance');
    expect(await isHidden($orderByRelevance)).toBeTruthy();
  });

  it('does not show the "clear search" button on load', async () => {
    const $searchClear = await page.$('#search-clear');
    expect(await isHidden($searchClear)).toBeTruthy();
  });

  it('does not show the "no results" message on load', async () => {
    const $gridItemIfEmpty = await page.$('.grid-item--if-empty');
    expect(await isHidden($gridItemIfEmpty)).toBeTruthy();
  });

  it('shows the "order by relevance" button on search', async () => {
    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $orderByRelevance = await page.$('#order-relevance');
    expect(await isVisible($orderByRelevance)).toBeTruthy();
  });

  it('shows the "clear search" button on search', async () => {
    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $searchClear = await page.$('#search-clear');
    expect(await isVisible($searchClear)).toBeTruthy();
  });

  it('enables ordering by relevance on search', async () => {
    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-by-relevance')).toBeTruthy();
  });

  it('does not show the "no results" message on search', async () => {
    const $gridItemIfEmpty = await page.$('.grid-item--if-empty');
    expect(await isHidden($gridItemIfEmpty)).toBeTruthy();
  });

  it('resets the search when clicking the "clear search" button', async () => {
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
  ])('switches back to "%s" when the search is removed', async (id, value) => {
    await page.click(`#${id}`);

    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    await $searchInput.click({ clickCount: 3 });
    await $searchInput.press('Backspace');

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-by-relevance')).toBeFalsy();
    expect(await hasClass($body, value)).toBeTruthy();
  });

  it.each([
    ['order-alpha', 'order-alphabetically'],
    ['order-color', 'order-by-color'],
  ])('switches back to "%s" when search is cleared', async (id, value) => {
    await page.click(`#${id}`);

    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $searchClear = await page.$('#search-clear');
    await $searchClear.click();

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-by-relevance')).toBeFalsy();
    expect(await hasClass($body, value)).toBeTruthy();
  });

  it('adds the search query to the URL', async () => {
    const query = 'amd';

    const $searchInput = await page.$('#search-input');
    await $searchInput.type(query, { delay: 100 });

    const url = page.url();
    expect(url).toMatch(`?q=${query}`);
  });

  it('loads the search query from the URL', async () => {
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

  it('shows the "no results" message if no brand was found', async () => {
    await page.type('#search-input', 'this is definitely not going to match');
    await page.screenshot({
      path: path.resolve(ARTIFACTS_DIR, 'desktop_no-search-results.png'),
    });

    const $gridItemIfEmpty = await page.$('.grid-item--if-empty');
    expect(await isVisible($gridItemIfEmpty)).toBeTruthy();
  });

  it('hides the "no results" message when the search is removed', async () => {
    const $searchInput = await page.$('#search-input');
    await $searchInput.type('this is definitely not going to match');

    await $searchInput.click({ clickCount: 3 });
    await $searchInput.press('Backspace');

    const $gridItemIfEmpty = await page.$('.grid-item--if-empty');
    expect(await isHidden($gridItemIfEmpty)).toBeTruthy();
  });

  afterEach(async () => {
    await page.close();
  });
});

describe('Ordering', () => {
  const icons = Object.values(simpleIcons);
  const titles = icons.map(icon => icon.title);
  const hexes = icons.map(icon => icon.hex).sort(sortColors);

  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(url.href);
  });

  it('reloads ordering alphabetically', async () => {
    await expect(page).toClick('#order-alpha');

    await page.reload();

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-alphabetically')).toBeTruthy();
  });

  it('reloads ordering by color', async () => {
    await expect(page).toClick('#order-color');

    await page.reload();

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-by-color')).toBeTruthy();
  });

  it('orders grid items alphabetically', async () => {
    await expect(page).toClick('#order-alpha');

    const $gridItems = await page.$$('.grid-item');
    for (let i = 0; i < $gridItems.length; i++) {
      const $gridItem = $gridItems[i];
      const title = titles[i];
      await expect($gridItem).toMatch(title);
    }
  });

  it.skip('orders grid items by color', async () => {
    // Items are ordered using the CSS property `order`...
    await expect(page).toClick('#order-color');

    const $gridItems = await page.$$('.grid-item__color');
    for (let i = 0; i < $gridItems.length; i++) {
      const $gridItem = $gridItems[i];
      const hex = hexes[i];
      await expect($gridItem).toMatch(`#${hex}`);
    }
  });

  afterEach(async () => {
    await page.close();
  });
});

describe('Preferred color scheme', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
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
      path: path.resolve(ARTIFACTS_DIR, `desktop_${scheme}-mode.png`),
    });

    const bodyBackgroundColor = await page.evaluate(() => {
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      return bgColor;
    });
    expect(bodyBackgroundColor).toEqual(expected);
  });

  it.each([
    ['light', '#color-scheme-dark', 'rgb(34, 34, 34)'],
    ['light', '#color-scheme-light', 'rgb(252, 252, 252)'],
    ['dark', '#color-scheme-dark', 'rgb(34, 34, 34)'],
    ['dark', '#color-scheme-light', 'rgb(252, 252, 252)'],
  ])('is "%s" but "%s" is selected', async (scheme, id, expected) => {
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: scheme },
    ]);

    await expect(page).toClick(id);

    const bodyBackgroundColor = await page.evaluate(() => {
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      return bgColor;
    });

    expect(bodyBackgroundColor).toEqual(expected);
  });

  it('reloads with system color scheme', async () => {
    await expect(page).toClick('#color-scheme-system');

    await page.reload();

    const $body = await page.$('body');
    expect(await hasClass($body, 'dark')).toBeFalsy();
    expect(await hasClass($body, 'light')).toBeFalsy();
  });

  it('reloads with dark color scheme', async () => {
    await expect(page).toClick('#color-scheme-dark');

    await page.reload();

    const $body = await page.$('body');
    expect(await hasClass($body, 'dark')).toBeTruthy();
    expect(await hasClass($body, 'light')).toBeFalsy();
  });

  it('reloads with light color scheme', async () => {
    await expect(page).toClick('#color-scheme-light');

    await page.reload();

    const $body = await page.$('body');
    expect(await hasClass($body, 'dark')).toBeFalsy();
    expect(await hasClass($body, 'light')).toBeTruthy();
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

  it('has the color value button enabled', async () => {
    const $previewButton = await page.$('button.grid-item__color');
    expect(await isDisabled($previewButton)).toBeFalsy();
  });

  it('copies the hex value when it is clicked', async () => {
    await expect(page).toClick('button.grid-item__color');
    const clipboardValue = await getClipboardValue(page);
    expect(clipboardValue).toMatch(COLOR_REGEX);
  });

  it('has the SVG preview button enabled', async () => {
    const $previewButton = await page.$('button.grid-item__preview');
    expect(await isDisabled($previewButton)).toBeFalsy();
  });

  it('copies the SVG value when the preview is clicked', async () => {
    await expect(page).toClick('button.grid-item__preview');
    const clipboardValue = await getClipboardValue(page);
    expect(clipboardValue).toMatch(SVG_REGEX);
  });

  it('is possible to download an icon as SVG', async () => {
    await expect(page).toClick('a[download][href$="svg"]');
  });

  it('is possible to download an icon as PDF', async () => {
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
      path: path.resolve(ARTIFACTS_DIR, 'desktop_js-disabled.png'),
    });
  });

  it('does not show the "order by relevance" button', async () => {
    const $orderByRelevance = await page.$('#order-relevance');
    expect(await isHidden($orderByRelevance)).toBeTruthy();
  });

  it('does not show the "clear search" button on load', async () => {
    const $searchClear = await page.$('#search-clear');
    expect(await isHidden($searchClear)).toBeTruthy();
  });

  it('has disabled ordering buttons', async () => {
    const $orderAlphabetically = await page.$('#order-alpha');
    expect(await isDisabled($orderAlphabetically)).toBeTruthy();

    const $orderByColor = await page.$('#order-color');
    expect(await isDisabled($orderByColor)).toBeTruthy();

    const $orderByRelevance = await page.$('#order-relevance');
    expect(await isDisabled($orderByRelevance)).toBeTruthy();
  });

  it('has the color value button disabled', async () => {
    const $colorButton = await page.$('button.grid-item__color');
    expect(await isDisabled($colorButton)).toBeTruthy();
  });

  it('has the SVG preview button disabled', async () => {
    const $previewButton = await page.$('button.grid-item__preview');
    expect(await isDisabled($previewButton)).toBeTruthy();
  });

  afterEach(async () => {
    await page.close();
  });
});
