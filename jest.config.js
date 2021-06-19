const { execSync } = require('child_process');
const path = require('path');

const TEST_ENV_ALL = 'all';
const TEST_ENV_INTEGRATION = 'integration';
const TEST_ENV_UNIT = 'unit';

const TEST_ENV_OPTIONS = [TEST_ENV_ALL, TEST_ENV_INTEGRATION, TEST_ENV_UNIT];
if (!TEST_ENV_OPTIONS.includes(process.env.TEST_ENV)) {
  console.info(`[ERROR] please set TEST_ENV to one of [${TEST_ENV_OPTIONS}]`);
  process.exit(1);
}

buildWebsite(process.env.TEST_ENV);

module.exports = {
  bail: getBail(process.env.TEST_ENV),
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
  const buildWebsiteEnvs = [TEST_ENV_ALL, TEST_ENV_INTEGRATION];
  if (buildWebsiteEnvs.includes(env)) {
    console.info('building website for integration tests...');
    execSync('npm run clean');
    execSync('npm run build:dev');
  }
}

function getBail(env) {
  const bailEarlyEnvs = [TEST_ENV_ALL, TEST_ENV_INTEGRATION];
  return bailEarlyEnvs.includes(env) ? 1 : 0;
}

function getIgnorePattern(env) {
  const ignorePaths = [];

  const ignoreIntegrationEnvs = [TEST_ENV_UNIT];
  if (ignoreIntegrationEnvs.includes(env)) {
    ignorePaths.push('integration.test.js');
  }

  return ignorePaths;
}

function getPreset(env) {
  const jestPuppeteerEnvs = [TEST_ENV_ALL, TEST_ENV_INTEGRATION];
  return jestPuppeteerEnvs.includes(env) ? 'jest-puppeteer' : undefined;
}

function getTestMatch(env) {
  if (env === TEST_ENV_INTEGRATION) {
    return ['**/tests/integration.test.js'];
  }

  return ['**/tests/*.test.js'];
}
