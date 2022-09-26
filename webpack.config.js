import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import getRelativeLuminance from 'get-relative-luminance';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import util from 'node:util';
import * as simpleIcons from 'simple-icons/icons';
import { siTwitter as twitterIcon } from 'simple-icons/icons';
import alphaSort from './scripts/alpha-sorting.js';
import colorSort from './scripts/color-sorting.js';
import GET from './scripts/GET.js';
import {
  DEFAULT_LANGUAGE,
  getLanguages,
  loadTranslations,
  updateTranslations,
} from './scripts/i18n.js';
import {
  getDirnameFromImportMeta,
  getThirdPartyExtensions,
  getIconsData,
  getIconSlug,
} from './si-utils.js';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const siRootDir = path.resolve(__dirname, 'node_modules', 'simple-icons');
const siReadmePath = path.join(siRootDir, 'README.md');

const allIcons = alphaSort(simpleIcons);
const sortedHexes = colorSort(allIcons.map((icon) => icon.hex));

const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const OUT_DIR = path.resolve(__dirname, '_site');
const ROOT_DIR = path.resolve(__dirname, 'public');

const indexPath = path.resolve(ROOT_DIR, 'index.pug');
const currentIsoDateString = new Date().toISOString();

const getIconsDataBySlugs = async () => {
  const dataBySlugs = {};
  (await getIconsData(siRootDir)).forEach((iconData) => {
    dataBySlugs[getIconSlug(iconData)] = iconData;
  });
  return dataBySlugs;
};

const getIconPlainAliases = (iconData) => {
  const aliases = [];
  if (iconData.aliases) {
    if (iconData.aliases.aka) {
      Array.prototype.push.apply(aliases, iconData.aliases.aka);
    }
    if (iconData.aliases.dup) {
      Array.prototype.push.apply(
        aliases,
        iconData.aliases.dup.map((dup) => dup.title),
      );
    }
    if (iconData.aliases.loc) {
      Array.prototype.push.apply(aliases, Object.values(iconData.aliases.loc));
    }
  }
  return aliases;
};

const getIconLocalizedTitles = (iconData, languages) => {
  const localizedTitles = {};
  if (iconData.aliases && iconData.aliases.loc) {
    for (const locale of Object.keys(iconData.aliases.loc)) {
      const normalizedLocale = locale.substring(0, DEFAULT_LANGUAGE.length);
      if (
        languages.includes(normalizedLocale) &&
        !localizedTitles[normalizedLocale]
      ) {
        localizedTitles[normalizedLocale] = iconData.aliases.loc[locale];
      }
    }
  }
  return localizedTitles;
};

const simplifyHexIfPossible = (hex) => {
  if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
    return `${hex[0]}${hex[2]}${hex[4]}`;
  }

  return hex;
};

const sitemapUrlForLanguage = (language) => {
  const url = `https://simpleicons.org/${language}/`;
  return (
    `\n  <url>\n    <loc>${url}</loc>\n` +
    `    <lastmod>${currentIsoDateString}</lastmod>\n` +
    `    <changefreq>weekly</changefreq>\n` +
    `    <xhtml:link rel="alternate" hreflang="${language}" href="${url}"/>\n  </url>`
  );
};

let displayIcons = allIcons;
if (process.env.TEST_ENV) {
  // Use fewer icons when building for a test run. This significantly speeds up
  // page load time and therefor (end-to-end) tests, reducing the chance of
  // failed tests due to timeouts.
  displayIcons = allIcons.slice(0, 255);

  // Ensure that some icons needed by the tests are added
  const ensureIconDisplayed = (iconSlug) => {
    const iconFound = displayIcons.find((icon) => icon.slug === iconSlug);

    if (!iconFound) {
      const iconToDisplay = allIcons.find((icon) => icon.slug === iconSlug);
      if (!iconToDisplay) {
        console.error(`Slug "${iconSlug}" not found in icons`);
        process.exit(1);
      }
      displayIcons.push(iconToDisplay);
    }
  };

  ['adobe', 'aew', 'gotomeeting', 'kinopoisk'].forEach((slug) =>
    ensureIconDisplayed(slug),
  );
}

const pageDescription = `${allIcons.length} Free SVG icons for popular brands`;
const pageTitle = 'Simple Icons';
const pageUrl = 'https://simpleicons.org';
const logoUrl = `${pageUrl}/icons/simpleicons.svg`;

const generateStructuredData = async () => {
  const getSimpleIconsMembers = async () => {
    const siMembersCacheFilePath = path.join(
      os.tmpdir(),
      'simple-icons-members.json',
    );
    let siMembersFileContent;
    try {
      siMembersFileContent = await fs.readFile(siMembersCacheFilePath, 'utf8');
    } catch (error) {
      const siOrgMembers = await GET(
        'api.github.com',
        '/orgs/simple-icons/members',
      );

      const users = await Promise.all(
        siOrgMembers.map(async (member) =>
          Object.assign(
            member,
            await GET('api.github.com', `/users/${member.login}`),
          ),
        ),
      );

      const structuredDataMembers = users.map((user) => {
        return {
          '@type': 'Person',
          name: user.name,
          jobTitle: 'Maintainer',
          url: user.html_url,
          image: user.avatar_url,
        };
      });

      await fs.writeFile(
        siMembersCacheFilePath,
        JSON.stringify(structuredDataMembers),
      );

      return structuredDataMembers;
    }

    return JSON.parse(siMembersFileContent);
  };

  return {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: pageTitle,
    description: pageDescription,
    logo: logoUrl,
    image: logoUrl,
    url: pageUrl,
    members: await getSimpleIconsMembers(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${pageUrl}/?q={search-term}`,
      'query-input': 'required name=search-term',
    },
  };
};

let _translationsUpdated = false;
let i18n;

export default async (env, argv) => {
  if (!_translationsUpdated) {
    await updateTranslations();
    i18n = await loadTranslations();
    _translationsUpdated = true;
  }

  const languageNames = await getLanguages();
  const languages = Object.keys(languageNames);
  const nonDefaultLanguages = languages.filter(
    (language) => language !== DEFAULT_LANGUAGE,
  );

  const extensions = await getThirdPartyExtensions(siReadmePath);
  const structuredData = await generateStructuredData();

  const iconsDataBySlugs = await getIconsDataBySlugs();
  const icons = displayIcons.map((icon, iconIndex) => {
    const luminance = getRelativeLuminance.default(`#${icon.hex}`);
    const plainAliases = getIconPlainAliases(iconsDataBySlugs[icon.slug]);

    return {
      guidelines: icon.guidelines,
      hex: icon.hex,
      indexByAlpha: iconIndex,
      indexByColor: sortedHexes.indexOf(icon.hex),
      license: icon.license,
      light: luminance < 0.4,
      superLight: luminance > 0.95,
      superDark: luminance < 0.02,
      path: icon.path,
      shortHex: simplifyHexIfPossible(icon.hex),
      slug: icon.slug,
      title: icon.title,
      plainAliases: plainAliases.length ? plainAliases : false,
      localizedTitles: getIconLocalizedTitles(
        iconsDataBySlugs[icon.slug],
        languages,
      ),
    };
  });

  return {
    entry: {
      app: path.resolve(ROOT_DIR, 'scripts/index.js'),
    },
    output: {
      path: OUT_DIR,
      filename: 'script.js',
    },
    infrastructureLogging: {
      // Hide false warning raised by Webpack:
      // https://github.com/webpack/webpack/issues/15574
      level: 'error',
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.pug$/i,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: argv.mode === 'development',
              },
            },
          ],
        },
        {
          test: /\.svg$/i,
          type: 'asset/inline',
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(NODE_MODULES, 'simple-icons/icons'),
            to: path.resolve(OUT_DIR, 'icons'),
            filter: (filepath) => filepath.endsWith('.svg'),
          },
          {
            from: path.resolve(NODE_MODULES, 'simple-icons-pdf/icons'),
            to: path.resolve(OUT_DIR, 'icons'),
            filter: (filepath) => filepath.endsWith('.pdf'),
          },
          {
            from: path.resolve(ROOT_DIR, 'images'),
            to: path.resolve(OUT_DIR, 'images'),
          },
          {
            from: path.resolve(__dirname, 'LICENSE.md'),
            to: path.resolve(OUT_DIR, 'license.txt'),
          },
          {
            // Add sitemap.xml
            from: path.resolve(ROOT_DIR, 'sitemap.template.xml'),
            to: path.resolve(OUT_DIR, 'sitemap.xml'),
            transform: (content) => {
              // inject last modification date in W3C datetime format
              return util.format(
                content.toString('ascii'),
                currentIsoDateString,
                nonDefaultLanguages
                  .map((lang) => sitemapUrlForLanguage(lang))
                  .join(''),
              );
            },
          },
        ],
      }),
      ...languages.map((lang) => {
        // Add localized title for the icons in the property `localizedTitle`
        const currentLangIcons =
          lang === DEFAULT_LANGUAGE
            ? [...icons]
            : [...icons].map((icon_) => {
                const icon = { ...icon_ };
                if (icon.localizedTitles[lang]) {
                  icon.localizedTitle = icon.localizedTitles[lang];
                }
                return icon;
              });

        return new HtmlWebpackPlugin({
          filename:
            lang === DEFAULT_LANGUAGE
              ? 'index.html'
              : path.join(lang, 'index.html'),
          inject: true,
          template: indexPath,
          templateParameters: {
            extensions,
            icons: currentLangIcons,
            iconCount: currentLangIcons.length,
            twitterIcon,
            pageTitle,
            pageUrl,
            structuredData,
            DEFAULT_LANGUAGE,
            t_: i18n(lang),
            languageOfTheBuild: lang,
            languages,
            languageNames,
          },
          minify:
            argv.mode === 'development'
              ? {}
              : {
                  collapseWhitespace: true,
                  collapseBooleanAttributes: true,
                  decodeEntities: true,
                  removeAttributeQuotes: true,
                  removeComments: true,
                  removeOptionalTags: true,
                  removeRedundantAttributes: true,
                },
        });
      }),
      new MiniCssExtractPlugin(),
    ],
    optimization: {
      minimizer:
        argv.mode === 'development'
          ? []
          : [
              // Load all default minimizers with '...'
              '...',
              new CssMinimizerPlugin(),
            ],
    },
    cache: process.argv.includes('--watch')
      ? { type: 'memory' }
      : {
          cacheLocation: path.resolve(
            __dirname,
            '.cache',
            process.argv.includes('development') ? 'webpack-dev' : 'webpack',
          ),
          type: 'filesystem',
          version: '1',
        },
  };
};
