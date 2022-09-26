/**
 * @fileoverview
 * Simple HTTPs GET request.
 */

import https from 'node:https';

export default (hostname, path) => {
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
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};
