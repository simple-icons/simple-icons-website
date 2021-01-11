const path = require('path');

module.exports = {
  preset: 'jest-puppeteer',
  globals: {
    ARTIFACTS_DIR: path.resolve(__dirname, 'tests/_artifacts'),
  },
}
