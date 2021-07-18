const { execSync } = require('child_process');
const path = require('path');

const TEST_ENV_ALL = 'all';
const TEST_ENV_E2E = 'e2e';
const TEST_ENV_UNIT = 'unit';

const TEST_ENV_OPTIONS = [TEST_ENV_ALL, TEST_ENV_E2E, TEST_ENV_UNIT];
if (!TEST_ENV_OPTIONS.includes(process.env.TEST_ENV)) {
  console.info(`[ERROR] please set TEST_ENV to one of [${TEST_ENV_OPTIONS}]`);
  process.exit(1);
}

buildWebsite(process.env.TEST_ENV);

module.exports = {
  bail: getBail(process.env.TEST_ENV),
  cacheDirectory: './.cache/jest',
  preset: getPreset(process.env.TEST_ENV),
  globals: {
    ARTIFACTS_DIR: path.resolve(__dirname, 'tests/_artifacts'),
  },
  testMatch: [...getTestMatch(process.env.TEST_ENV)],
  testPathIgnorePatterns: [
    '/node_modules/',
    ...getIgnorePattern(process.env.TEST_ENV),
  ],
};

function buildWebsite(env) {
  const buildWebsiteEnvs = [TEST_ENV_ALL, TEST_ENV_E2E];
  if (buildWebsiteEnvs.includes(env)) {
    console.info('building website for end-to-end tests...');
    execSync('npm run clean');
    execSync('npm run build');
  }
}

function getBail(env) {
  const bailEarlyEnvs = [TEST_ENV_ALL, TEST_ENV_E2E];
  return bailEarlyEnvs.includes(env) ? 1 : 0;
}

function getIgnorePattern(env) {
  const ignorePaths = [];

  const ignoreE2eEnvs = [TEST_ENV_UNIT];
  if (ignoreE2eEnvs.includes(env)) {
    ignorePaths.push('e2e.test.js');
  }

  return ignorePaths;
}

function getPreset(env) {
  const jestPuppeteerEnvs = [TEST_ENV_ALL, TEST_ENV_E2E];
  return jestPuppeteerEnvs.includes(env) ? 'jest-puppeteer' : undefined;
}

function getTestMatch(env) {
  if (env === TEST_ENV_E2E) {
    return ['**/tests/e2e.test.js'];
  }

  return ['**/tests/*.test.js'];
}
