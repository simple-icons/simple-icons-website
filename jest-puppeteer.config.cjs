module.exports = {
  launch: {
    headless: process.env.TEST_HEADLESS === 'false' ? false : true,
  },
  server: {
    command: 'npm run serve',
    port: 8080,
  },
};
