const { execSync } = require('child_process');
const path = require('path');

const TEST_ENV_ALL = 'all';
const TEST_ENV_UNIT = 'unit';
const TEST_ENV_OPTIONS = [TEST_ENV_ALL, TEST_ENV_UNIT];

let bail = 0;
let preset = undefined;
let ignorePaths = ['/node_modules/'];

switch (process.env.TEST_ENV) {
  case TEST_ENV_ALL:
    console.info('building website for integration tests...');
    execSync('npm run clean');
    execSync('npm run build');

    bail = 1; // Fail immediately to avoid running costly tests unnecessarily
    preset = 'jest-puppeteer';
    break;
  case TEST_ENV_UNIT:
    ignorePaths.push('integration.test.js');
    break;
  default:
    console.info(`[ERROR] please set TEST_ENV to one of [${TEST_ENV_OPTIONS}]`);
    process.exit(1);
}

module.exports = {
  bail,
  preset,
  globals: {
    ARTIFACTS_DIR: path.resolve(__dirname, 'tests/_artifacts'),
  },
  testPathIgnorePatterns: ignorePaths,
};
