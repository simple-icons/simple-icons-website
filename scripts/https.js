/**
 * @fileoverview
 * Simple HTTPs GET request.
 */

import https from 'node:https';

export const GET = (hostname, path) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method: 'GET',
      headers: {
        'user-agent': 'simple-icons-website',
      },
    };

    const req = https.request(options, (res) => {
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

export const POST = (hostname, path, data) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method: 'POST',
      headers: {
        'user-agent': 'simple-icons-website',
      },
    };

    const req = https.request(options, (res) => {
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

/* eslint-disable require-await */
export const githubAPI = {
  GET: async (path) => {
    return GET('api.github.com', path);
  },
  POST: async (path, data) => {
    return POST('api.github.com', path, data);
  },
};
/* eslint-enable require-await */
