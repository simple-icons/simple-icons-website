const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const getRelativeLuminance = require('get-relative-luminance').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const fs = require('fs');
const os = require('os');
const simpleIcons = require('simple-icons');
const sortByColors = require('./scripts/color-sorting.js');
const GET = require('./scripts/GET.js');

const icons = Object.values(simpleIcons).sort((icon1, icon2) =>
  icon1.title.localeCompare(icon2.title),
);
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

const pageDescription = `${icons.length} Free SVG icons for popular brands.`,
  pageTitle = 'Simple Icons',
  pageUrl = 'https://simpleicons.org',
  logoUrl = 'https://simpleicons.org/icons/simpleicons.svg';

async function generateStructuredData() {
  const getSimpleIconsMembers = new Promise(async (resolve, reject) => {
    const siMembersCacheFilePath = path.join(
      os.tmpdir(),
      'simple-icons-members.json',
    );
    if (fs.existsSync(siMembersCacheFilePath)) {
      try {
        const siMembersFileContent = fs.readFileSync(siMembersCacheFilePath, {
          encoding: 'UTF8',
        });
        resolve(JSON.parse(siMembersFileContent));
      } catch (error) {
        reject(error);
      }
    } else {
      try {
        const siOrgMembers = await GET(
          'api.github.com',
          '/orgs/simple-icons/members',
        );

        const structuredDataMembersPromises = siOrgMembers.map((member) => {
          return new Promise(async (_resolve) => {
            try {
              _resolve(
                Object.assign(
                  member,
                  await GET('api.github.com', `/users/${member.login}`),
                ),
              );
            } catch (error) {
              reject(error);
            }
          });
        });
        Promise.all(structuredDataMembersPromises).then((users) => {
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
          resolve(structuredDataMembers);
        });
      } catch (error) {
        reject(error);
      }
    }
  });

  return {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: pageTitle,
    description: pageDescription,
    logo: logoUrl,
    image: logoUrl,
    url: pageUrl,
    members: await getSimpleIconsMembers,
  };
}

module.exports = async (env, argv) => {
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
