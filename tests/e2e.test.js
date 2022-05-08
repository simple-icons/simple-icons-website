import { jest } from '@jest/globals';

import sortByColors from '../scripts/color-sorting.js';

import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';
import puppeteer from 'puppeteer';
import simpleIcons from 'simple-icons';

import {
  getClipboardValue,
  getValue,
  hasClass,
  isDisabled,
  isHidden,
  isInViewport,
  isVisible,
  getTextContent,
} from './helpers.js';

jest.retryTimes(3);
jest.setTimeout(3000);

const COLOR_REGEX = /^#[A-F0-9]{6}$/;
const SVG_REGEX = /^<svg.*>.*<\/svg>$/;

const DEFAULT_DEVICE = {
  name: 'Desktop (785x600)',
  userAgent:
    'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML like Gecko) Version/7.2.1.0 Safari/536.2+',
  viewport: {
    width: 785,
    height: 600,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false,
  },
};

const url = new URL('http://localhost:8080/');

beforeAll(() => {
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR);
  }
});

describe.each([
  ['desktop', DEFAULT_DEVICE],
  ['mobile', puppeteer.devices['Nexus 7']],
])('General (%s)', (name, device) => {
  beforeEach(async () => {
    await page.emulate(device);
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

  it('has the search input in view on load', async () => {
    const $searchInput = await page.$('#search-input');
    expect(await isInViewport($searchInput)).toBeTruthy();
  });

  it('has the order controls in view on load', async () => {
    const $orderAlpha = await page.$('#order-alpha');
    expect(await isInViewport($orderAlpha)).toBeTruthy();

    const $orderColor = await page.$('#order-color');
    expect(await isInViewport($orderColor)).toBeTruthy();
  });

  it('has the first grid item in view on load', async () => {
    const $firstGridItem = await page.$('.grid-item');
    expect(await isInViewport($firstGridItem)).toBeTruthy();
  });

  it('hides the #copy-input element', async () => {
    const $copyInput = await page.$('#copy-input');
    expect(await isHidden($copyInput)).toBeTruthy();
  });

  afterAll(async () => {
    await page.emulate(DEFAULT_DEVICE);
  });
});

describe('External links', () => {
  beforeEach(async () => {
    await page.goto(url.href);
  });

  describe.each([
    'Main Repository',
    'npm',
    'Packagist',
    'jsDelivr (Content Delivery Network)',
    'UNPKG (Content Delivery Network)',
    'Open Collective',
    'Legal Disclaimer',
  ])(`is possible to click menu links`, (title) => {
    it(`is possible to click the link for ${title}`, async () => {
      await expect(page).toClick(`a[title="${title}"]`);
    });
  });

  it(`is possible to click the button for Third-Party Extensions`, async () => {
    await expect(page).toClick('button[title="Third-Party Extensions"]');
  });

  it('is possible to click the link for Github repository', async () => {
    const footerRepositoryTitle = 'website repository';
    await expect(page).toClick(`a[title="${footerRepositoryTitle}"]`);
  });

  it('is possible to click extensions link', async () => {
    const extensionPopupLinks = await page.$$('.extensions__table a');
    extensionPopupLinks.forEach((link) =>
      expect(page).toClick(link.getProperty('innerText')),
    );
  });
});

describe('Search', () => {
  beforeEach(async () => {
    await page.goto(url.href);
  });

  it.each([
    ['by title', 'adobe', 'Adobe'],
    ['aka alias', 'All Elite Wrestling', 'AEW'],
    ['dup alias', 'GoToWebinar', 'GoToMeeting'],
    ['loc alias', 'КиноПоиск', 'KinoPoisk'],
  ])(
    'full match searching %s displays matching icon first',
    async (aliasesProp, typedTitle, expectedTitle) => {
      const $searchInput = await page.$('#search-input');
      await $searchInput.type(typedTitle);

      const $gridItem = await page.$('.grid-item');
      let content = await (
        await $gridItem.getProperty('textContent')
      ).jsonValue();

      // content should be 'Foo#FF0000'
      const [title, hex] = content.split('#');
      expect(title).toBe(expectedTitle);
      expect([3, 6, 8].includes(hex.length)).toBeTruthy();
    },
  );

  it('does not show the "order by relevance" button on load', async () => {
    const $orderRelevance = await page.$('#order-relevance');
    expect(await isHidden($orderRelevance)).toBeTruthy();
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

    const $orderRelevance = await page.$('#order-relevance');
    expect(await isVisible($orderRelevance)).toBeTruthy();
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
    expect(await hasClass($body, 'order-relevance')).toBeTruthy();
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
    ['order-alpha', 'order-alpha'],
    ['order-color', 'order-color'],
  ])('switches back to "%s" when the search is removed', async (id, value) => {
    await page.click(`#${id}`);

    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    await $searchInput.click({ clickCount: 3 });
    await $searchInput.press('Backspace');

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-relevance')).toBeFalsy();
    expect(await hasClass($body, value)).toBeTruthy();
  });

  it.each([
    ['order-alpha', 'order-alpha'],
    ['order-color', 'order-color'],
  ])('switches back to "%s" when search is cleared', async (id, value) => {
    await page.click(`#${id}`);

    const $searchInput = await page.$('#search-input');
    await $searchInput.type('adobe');

    const $searchClear = await page.$('#search-clear');
    await $searchClear.click();

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-relevance')).toBeFalsy();
    expect(await hasClass($body, value)).toBeTruthy();
  });

  it('adds the search query to the URL', async () => {
    const query = 'amd';

    const $searchInput = await page.$('#search-input');
    await $searchInput.type(query, { delay: 100 });

    expect(page.url()).toMatch(`?q=${query}`);
  });

  it('loads the search query from the URL', async () => {
    const query = 'simple icons';
    await page.goto(`${url.href}?q=${query}`);

    const $searchInput = await page.$('#search-input');
    const searchInputValue = await getValue($searchInput);
    expect(searchInputValue).toEqual(query);

    const $searchClear = await page.$('#search-clear');
    expect(await isVisible($searchClear)).toBeTruthy();

    const $orderRelevance = await page.$('#order-relevance');
    expect(await isVisible($orderRelevance)).toBeTruthy();
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
});

describe('Ordering', () => {
  // only first 30 icons, it's enough to test ordering
  const nIcons = 30;
  const icons = Object.values(simpleIcons).slice(0, nIcons);
  const titles = icons
    .map((icon) => icon.title)
    .sort((titleA, titleB) => titleA.localeCompare(titleB));

  beforeEach(async () => {
    await page.goto(url.href);
  });

  it('reloads alpha order', async () => {
    await expect(page).toClick('#order-alpha');

    await page.reload();

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-alpha')).toBeTruthy();
  });

  it('reloads ordering by color', async () => {
    await expect(page).toClick('#order-color');

    await page.reload();

    const $body = await page.$('body');
    expect(await hasClass($body, 'order-color')).toBeTruthy();
  });

  it('orders grid items alphabetically', async () => {
    await expect(page).toClick('#order-alpha');

    const $gridItems = await page.$$('.grid-item');
    for (let i = 0; i < nIcons; i++) {
      const $gridItem = $gridItems[i];
      const title = titles[i];
      await expect($gridItem).toMatch(title);
    }
  });

  it('orders grid items by color', async () => {
    await expect(page).toClick('#order-color');
    const $gridItems = await page.$$('button.grid-item__color');

    const hexes = [];
    for (let i = 0; i < nIcons; i++) {
      const $gridItem = $gridItems[i];
      const color = await getTextContent($gridItem);
      const hex = color.slice(1);
      hexes.push(hex);
    }
    await expect(sortByColors(hexes)).toEqual(hexes);
  });
});

describe('Preferred color scheme', () => {
  beforeEach(async () => {
    await page.goto(url.href);
  });

  it.each([
    ['dark', 'rgb(34, 34, 34)'],
    ['light', 'rgb(252, 252, 252)'],
  ])("has color scheme '%s'", async (scheme, expected) => {
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
});

describe('Grid item', () => {
  beforeEach(async () => {
    const context = browser.defaultBrowserContext();
    await context._connection.send('Browser.grantPermissions', {
      origin: url.origin,
      permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
    });
  });

  beforeEach(async () => {
    await page.goto(url.href);
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: ARTIFACTS_DIR,
    });
  });

  it('has the color value button enabled', async () => {
    const $previewButton = await page.$('button.copy-color');
    expect(await isDisabled($previewButton)).toBeFalsy();
  });

  it('copies the hex value when it is clicked', async () => {
    await expect(page).toClick('button.copy-color');
    const clipboardValue = await getClipboardValue(page);
    expect(clipboardValue).toMatch(COLOR_REGEX);
  });

  it('has the SVG preview button enabled', async () => {
    const $previewButton = await page.$('button.copy-svg');
    expect(await isDisabled($previewButton)).toBeFalsy();
  });

  it('copies the SVG value when the preview is clicked', async () => {
    await expect(page).toClick('button.copy-svg');
    const clipboardValue = await getClipboardValue(page);
    expect(clipboardValue).toMatch(SVG_REGEX);
  });

  it.each(['download-svg', 'download-pdf'])(
    'is possible to download an icon "%s"',
    async (fileType) => {
      await expect(page).toClick(`button#${fileType}`);
      await expect(page).toClick('a[download].grid-item__button');
    },
  );
});

describe('JavaScript disabled', () => {
  beforeEach(async () => {
    page.setJavaScriptEnabled(false);
    await page.goto(url.href);
  });

  it('produces a screenshot', async () => {
    await page.screenshot({
      path: path.resolve(ARTIFACTS_DIR, 'desktop_js-disabled.png'),
    });
  });

  it('does not show the "order by relevance" button', async () => {
    const $orderRelevance = await page.$('#order-relevance');
    expect(await isHidden($orderRelevance)).toBeTruthy();
  });

  it('does not show the "clear search" button on load', async () => {
    const $searchClear = await page.$('#search-clear');
    expect(await isHidden($searchClear)).toBeTruthy();
  });

  it('has disabled ordering buttons', async () => {
    const $orderAlpha = await page.$('#order-alpha');
    expect(await isDisabled($orderAlpha)).toBeTruthy();

    const $orderColor = await page.$('#order-color');
    expect(await isDisabled($orderColor)).toBeTruthy();

    const $orderRelevance = await page.$('#order-relevance');
    expect(await isDisabled($orderRelevance)).toBeTruthy();
  });

  it('has the color value button disabled', async () => {
    const $colorButton = await page.$('button.copy-color');
    expect(await isDisabled($colorButton)).toBeTruthy();
  });

  it('has the SVG preview button disabled', async () => {
    const $previewButton = await page.$('button.copy-svg');
    expect(await isDisabled($previewButton)).toBeTruthy();
  });

  afterAll(async () => {
    page.setJavaScriptEnabled(true);
  });
});

it('has a license file available', async () => {
  await page.goto(`${url.href}/license.txt`);
  await expect(page).toMatch('CC0 1.0 Universal');
});
