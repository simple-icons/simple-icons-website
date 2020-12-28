module.exports = {
  launch: {
    headless: process.env.TEST_HEADLESS === 'false' ? false : true,
  },
  server: {
    command: 'npm run serve -- -s',
    port: 8080,
  },
}
