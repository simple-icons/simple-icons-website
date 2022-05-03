import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import getRelativeLuminance from 'get-relative-luminance';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import simpleIcons from 'simple-icons';
import sortByColors from './scripts/color-sorting.js';
import GET from './scripts/GET.js';
import {
  getDirnameFromImportMeta,
  getThirdPartyExtensions,
} from './si-utils.js';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const icons = Object.values(simpleIcons).sort((icon1, icon2) =>
  icon1.title.localeCompare(icon2.title),
);
const sortedHexes = sortByColors(icons.map((icon) => icon.hex));

const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const OUT_DIR = path.resolve(__dirname, '_site');
const ROOT_DIR = path.resolve(__dirname, 'public');

const simplifyHexIfPossible = (hex) => {
  if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] == hex[5]) {
    return `${hex[0]}${hex[2]}${hex[4]}`;
  }

  return hex;
};

const siReadmePath = path.resolve(
  __dirname,
  'node_modules/simple-icons/README.md',
);

let displayIcons = icons;
if (process.env.TEST_ENV) {
  // Use fewer icons when building for a test run. This significantly speeds up
  // page load time and therefor (end-to-end) tests, reducing the chance of
  // failed tests due to timeouts.
  displayIcons = icons.slice(0, 255);
}

const pageDescription = `${icons.length} Free SVG icons for popular brands.`,
  pageTitle = 'Simple Icons',
  pageUrl = 'https://simpleicons.org',
  logoUrl = `${pageUrl}/icons/simpleicons.svg`;

const generateStructuredData = async () => {
  const getSimpleIconsMembers = async () => {
    const siMembersCacheFilePath = path.join(
      os.tmpdir(),
      'simple-icons-members.json',
    );
    if (fs.existsSync(siMembersCacheFilePath)) {
      const siMembersFileContent = fs.readFileSync(
        siMembersCacheFilePath,
        'utf8',
      );
      return JSON.parse(siMembersFileContent);
    } else {
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

      fs.writeFileSync(
        siMembersCacheFilePath,
        JSON.stringify(structuredDataMembers),
      );

      return structuredDataMembers;
    }
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

export default async (env, argv) => {
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
            filter: (path) => path.endsWith('.svg'),
          },
          {
            from: path.resolve(NODE_MODULES, 'simple-icons-pdf/icons'),
            to: path.resolve(OUT_DIR, 'icons'),
            filter: (path) => path.endsWith('.pdf'),
          },
          {
            from: path.resolve(ROOT_DIR, 'images'),
            to: path.resolve(OUT_DIR, 'images'),
          },
          {
            from: path.resolve(__dirname, 'LICENSE.md'),
            to: path.resolve(OUT_DIR, 'license.txt'),
          },
        ],
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(ROOT_DIR, 'index.pug'),
        templateParameters: {
          extensions: await getThirdPartyExtensions(siReadmePath),
          icons: displayIcons.map((icon, iconIndex) => {
            const luminance = getRelativeLuminance.default(`#${icon.hex}`);
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
            };
          }),
          iconCount: icons.length,
          twitterIcon: icons.find((icon) => icon.title === 'Twitter'),
          pageTitle,
          pageDescription,
          pageUrl,
          structuredData: await generateStructuredData(),
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
      }),
      new MiniCssExtractPlugin(),
    ],
    optimization: {
      minimizer:
        argv.mode === 'development'
          ? []
          : [
              '...', // <- Load all default minimizers
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
