const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const getRelativeLuminance = require('get-relative-luminance').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const simpleIcons = require('simple-icons');
const sortColors = require('color-sorter').sortFn;

const { normalizeSearchTerm } = require('./scripts/utils.js');

const icons = Object.values(simpleIcons);
const sortedHexes = icons.map(icon => icon.hex).sort(sortColors);

const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const OUT_DIR = path.resolve(__dirname, '_site');
const ROOT_DIR = path.resolve(__dirname);

function simplifyHexIfPossible(hex) {
  if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] == hex[5]) {
    return `${hex[0]}${hex[2]}${hex[4]}`;
  }

  return hex;
}

function tmp(hex) {
  const luminance = getRelativeLuminance(`#${hex}`);
  return luminance < 0.4;
}

module.exports = {
  entry: {
    app: [
      './scripts/index.js',
    ],
  },
  output: {
    path: OUT_DIR,
    filename: 'script.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
        { // Copy SVGs from simple-icons
          from: path.resolve(NODE_MODULES, 'simple-icons/icons'),
          to: path.resolve(OUT_DIR, 'icons'),
          filter: (path) => path.endsWith('.svg'),
        },
        { // Copy ./images
          from: path.resolve(ROOT_DIR, 'images'),
          to: path.resolve(OUT_DIR, 'images'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT_DIR, 'index.pug'),
      inject: true,
      templateParameters: {
        icons: icons.map((icon, iconIndex) => {
          return {
            hex: icon.hex,
            indexByAlpha: iconIndex,
            indexByColor: sortedHexes.indexOf(icon.hex),
            light: tmp(icon.hex),
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
