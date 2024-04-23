const process = require('node:process');

module.exports = {
  launch: {
    headless: process.env.TEST_HEADLESS !== 'false',
  },
  server: {
    command: 'npm run serve',
    port: 8080,
  },
};
