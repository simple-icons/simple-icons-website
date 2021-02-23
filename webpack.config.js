const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const getRelativeLuminance = require('get-relative-luminance').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const simpleIcons = require('simple-icons');
const simpleIconsData = require('simple-icons/_data/simple-icons.json');
const sortColors = require('color-sorter').sortFn;

const { normalizeSearchTerm } = require('./public/scripts/utils.js');

const icons = Object.values(simpleIcons);
const sortedHexes = icons
  .map((icon) => icon.hex)
  .filter((hex, index, array) => array.indexOf(hex) === index)
  .sort(sortColors);

const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const OUT_DIR = path.resolve(__dirname, '_site');
const ROOT_DIR = path.resolve(__dirname, 'public');

function simplifyHexIfPossible(hex) {
  if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] == hex[5]) {
    return `${hex[0]}${hex[2]}${hex[4]}`;
  }

  return hex;
}

function getGuidelinesFor(title) {
  let result;
  simpleIconsData.icons.forEach((icon) => {
    if (icon.title !== title) {
      return;
    }
    if (icon.guidelines) {
      result = icon.guidelines;
    }
  });

  return result;
}

function getLicenseFor(title) {
  let result;
  simpleIconsData.icons.forEach((icon) => {
    if (icon.title !== title) {
      return;
    }
    if (icon.license) {
      console.log(icon);
      result = icon.license;
    }
  });

  return result;
}

module.exports = {
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
        use: ['pug-loader'],
      },
      {
        test: /\.svg$/i,
        use: ['svg-url-loader'],
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
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(ROOT_DIR, 'index.pug'),
      templateParameters: {
        icons: icons.map((icon, iconIndex) => {
          const luminance = getRelativeLuminance(`#${icon.hex}`);
          return {
            guidelines: getGuidelinesFor(icon.title),
            hex: icon.hex,
            indexByAlpha: iconIndex,
            indexByColor: sortedHexes.indexOf(icon.hex),
            license: getLicenseFor(icon.title),
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
      },
    }),
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    minimizer: [
      '...', // <- Load all default minimizers
      new CssMinimizerPlugin(),
    ],
  },
};
