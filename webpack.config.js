const path = require('path');
const sortColors = require('color-sorter').sortFn;
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const simpleIcons = require('simple-icons');
const getRelativeLuminance = require('get-relative-luminance').default;
const { normalizeSearchTerm } = require('./scripts/utils.js');

const icons = Object.values(simpleIcons);
const sortedHexes = icons.map(icon => icon.hex).sort(sortColors);

const OUT_DIR = path.resolve(__dirname, '_site');

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
        test: /\.pug$/,
        use: ['pug-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'node_modules/simple-icons/icons'),
          to: path.resolve(OUT_DIR, 'icons'),
          filter: (path) => path.endsWith('.svg'),
        },
        {
          from: path.resolve(__dirname, 'assets'),
          to: path.resolve(OUT_DIR, 'assets'),
        },
        {
          from: path.resolve(__dirname, 'styles'),
          to: path.resolve(OUT_DIR, 'styles'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.pug'),
      inject: true,
      templateParameters: {
        icons: icons.map((icon, iconIndex) => {
          return {
            alphaIndex: iconIndex,
            colorIndex: sortedHexes.indexOf(icon.hex),
            hex: icon.hex,
            color: function(hex) {
              if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] == hex[5]) {
                return `${hex[0]}${hex[2]}${hex[4]}`;
              }

              return hex;
            }(icon.hex),
            light: getRelativeLuminance(`#${icon.hex}`) < 0.4 ? true : false,
            normalizedName: normalizeSearchTerm(icon.title),
            path: icon.path,
            slug: icon.slug,
            title: icon.title,
          };
        }),
        iconCount: icons.length,
      }
    }),
  ]
};