/**
 * @fileoverview
 * Simple HTTPs GET request.
 */

import https from 'node:https';

export const GET = (hostname, path, options) => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname,
      path,
      method: 'GET',
    };

    const opts = Object.assign(requestOptions, options);
    const req = https.request(opts, (res) => {
      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(result));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

export const POST = (hostname, path, data, options) => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname,
      path,
      method: 'POST',
    };
    const opts = Object.assign(requestOptions, options);
    const req = https.request(opts, (res) => {
      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(result));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
};

const fillGithubOptions = (options) => {
  const ghToken = process.env.GITHUB_TOKEN;

  if (!options.headers) {
    options.headers = {};
  }
  options.headers['User-Agent'] = 'simple-icons-website';

  if (ghToken) {
    options.headers.Authorization = `token ${ghToken}`;
  }
};

/* eslint-disable require-await */
export const githubAPI = {
  GET: async (path, options = {}) => {
    fillGithubOptions(options);
    return GET('api.github.com', path, options);
  },
  POST: async (path, data, options = {}) => {
    fillGithubOptions(options);
    return POST('api.github.com', path, data, options);
  },
};
/* eslint-enable require-await */
