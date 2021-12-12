const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const getRelativeLuminance = require('get-relative-luminance').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const fs = require('fs');
const simpleIcons = require('simple-icons');
const { normalizeSearchTerm } = require('./public/scripts/utils.js');
const sortByColors = require('./scripts/color-sorting.js');
const removedIcons = require('./scripts/removed-icons.js');

const icons = Object.values(simpleIcons);
const sortedHexes = sortByColors(icons.map((icon) => icon.hex));

const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const OUT_DIR = path.resolve(__dirname, '_site');
const ROOT_DIR = path.resolve(__dirname, 'public');

function parseExtensions() {
  const readmePath = path.resolve(
    __dirname,
    'node_modules/simple-icons/README.md',
  );
  const body = fs.readFileSync(readmePath, 'utf8');
  return body
    .split('## Third-Party Extensions\n\n')[1]
    .split('\n\n')[0]
    .split('\n')
    .slice(2)
    .map((line) => {
      const [module, author] = line.split(' | ');
      return {
        nameModule: /\[(.*?)\]/.exec(module)[1],
        urlModule: /\((.*?)\)/.exec(module)[1],
        nameAuthor: /\[(.*?)\]/.exec(author)[1],
        urlAuthor: /\((.*?)\)/.exec(author)[1],
      };
    });
}

function simplifyHexIfPossible(hex) {
  if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] == hex[5]) {
    return `${hex[0]}${hex[2]}${hex[4]}`;
  }

  return hex;
}
let extensions = parseExtensions();
let displayIcons = icons;
if (process.env.TEST_ENV) {
  // Use fewer icons when building for a test run. This significantly speeds up
  // page load time and therefor (end-to-end) tests, reducing the chance of
  // failed tests due to timeouts.
  displayIcons = icons.slice(0, 255);
}

module.exports = (env, argv) => {
  return {
    entry: {
      app: path.resolve(ROOT_DIR, 'scripts/index.js'),
    },
    output: {
      path: OUT_DIR,
      filename: 'script.js',
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
          extensions,
          icons: displayIcons.map((icon, iconIndex) => {
            const luminance = getRelativeLuminance(`#${icon.hex}`);
            return {
              base64Svg: Buffer.from(icon.svg).toString('base64'),
              guidelines: icon.guidelines,
              hex: icon.hex,
              indexByAlpha: iconIndex,
              indexByColor: sortedHexes.indexOf(icon.hex),
              license: icon.license,
              light: luminance < 0.4,
              superLight: luminance > 0.95,
              superDark: luminance < 0.02,
              normalizedName: normalizeSearchTerm(icon.title),
              path: icon.path,
              shortHex: simplifyHexIfPossible(icon.hex),
              slug: icon.slug,
              title: icon.title,
            };
          }),
          iconCount: icons.length,
          twitterIcon: icons.find((icon) => icon.title === 'Twitter'),
          pageTitle: 'Simple Icons',
          pageDescription: `${icons.length} Free SVG icons for popular brands.`,
          pageUrl: 'https://simpleicons.org',
        },
      }),
      new HtmlWebpackPlugin({
        inject: true,
        filename: 'removed.html',
        template: path.resolve(ROOT_DIR, 'removed.pug'),
        templateParameters: {
          removedIcons: removedIcons
            .sort((v1, v2) => v1.title.localeCompare(v2.title))
            .map((icon, iconIndex) => {
              const luminance = getRelativeLuminance(`#${icon.hex}`);
              return {
                base64Svg: Buffer.from(icon.path).toString('base64'),
                hex: icon.hex,
                light: luminance < 0.4,
                superLight: luminance > 0.95,
                superDark: luminance < 0.02,
                issue: icon.issue,
                versionIssue: icon.versionIssue,
                path: icon.path,
                title: icon.title,
              };
            }),
          iconCount: removedIcons.length,
          pageTitle: 'Removed Icons',
          pageDescription:
            "Removed icons in all previous versions. Some icons can't be shown since they were removed because the brand does not allow them to be modified to fit this library.",
          pageUrl: 'https://simpleicons.org/removed',
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
