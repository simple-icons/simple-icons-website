import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { ARTIFACTS_DIR } from './tests/constants.js';

const TEST_ENV_OPTIONS = ['all', 'e2e', 'unit'];
const [_, TEST_ENV_E2E, TEST_ENV_UNIT] = TEST_ENV_OPTIONS;
const env = process.env.TEST_ENV;

if (!TEST_ENV_OPTIONS.includes(env)) {
  console.error(
    `Please set TEST_ENV environment variable to one of [${TEST_ENV_OPTIONS}]`,
  );
  process.exit(1);
}

if (env !== TEST_ENV_UNIT) {
  console.info('Building website for end-to-end tests...');
  execSync('run-s clean build');

  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR);
  }
}

export default {
  bail: env === TEST_ENV_UNIT ? 0 : 1,
  cacheDirectory: './.cache/jest',
  preset: env === TEST_ENV_UNIT ? undefined : 'jest-puppeteer',
  testMatch: [
    `**/tests/${
      env === TEST_ENV_UNIT ? '!(e2e)' : env === TEST_ENV_E2E ? 'e2e' : '*'
    }.test.js`,
  ],
};
