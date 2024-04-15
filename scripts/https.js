/**
 * @fileoverview
 * Simple HTTPs GET request.
 */
import https from 'node:https';
import process from 'node:process';

export const get = (hostname, path, options) => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname,
      path,
      method: 'GET',
    };

    const options_ = Object.assign(requestOptions, options);
    const request = https.request(options_, (response) => {
      let result = '';

      response.on('data', (chunk) => {
        result += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(result));
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
};

export const post = (hostname, path, data, options) => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname,
      path,
      method: 'POST',
    };
    const options_ = Object.assign(requestOptions, options);
    const request = https.request(options_, (response) => {
      let result = '';

      response.on('data', (chunk) => {
        result += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(result));
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.write(JSON.stringify(data));
    request.end();
  });
};

const fillGithubOptions = (options) => {
  const ghToken = process.env.GITHUB_TOKEN;

  options.headers ||= {};

  options.headers['User-Agent'] = 'simple-icons-website';

  if (ghToken) {
    options.headers.Authorization = `token ${ghToken}`;
  }
};

export const githubApi = {
  async get(path, options = {}) {
    fillGithubOptions(options);
    return get('api.github.com', path, options);
  },
  async post(path, data, options = {}) {
    fillGithubOptions(options);
    return get('api.github.com', path, data, options);
  },
};
