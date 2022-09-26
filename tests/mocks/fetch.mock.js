/* eslint-disable no-inline-comments */

import { jest } from '@jest/globals';

export const newFetchTextMock = (value) => {
  return jest
    .fn()
    .mockName('fetch')
    .mockImplementation((/* url */) => {
      return new Promise((resolve) => {
        resolve({
          text: () => {
            return new Promise((resolve_) => {
              resolve_(value);
            });
          },
        });
      });
    });
};

export const fetch = newFetchTextMock('');
