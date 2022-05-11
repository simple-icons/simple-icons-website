import { execSync } from 'node:child_process';
import path from 'node:path';
import { getDirnameFromImportMeta } from './si-utils.js';

const __dirname = getDirnameFromImportMeta(import.meta.url);

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
}

export default {
  bail: env === TEST_ENV_UNIT ? 0 : 1,
  cacheDirectory: './.cache/jest',
  preset: env === TEST_ENV_UNIT ? undefined : 'jest-puppeteer',
  globals: {
    ARTIFACTS_DIR: path.resolve(__dirname, 'tests/_artifacts'),
  },
  testMatch: [
    `**/tests/${
      env === TEST_ENV_UNIT ? '!(e2e)' : env === TEST_ENV_E2E ? 'e2e' : '*'
    }.test.js`,
  ],
};
