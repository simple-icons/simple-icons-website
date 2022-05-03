import { jest } from '@jest/globals';

const STORAGE = new Map();

const hasItemImplementation = (key) => {
  return STORAGE.has(key);
};

const getItemImplementation = (key) => {
  if (!STORAGE.has(key)) {
    // As per: https://html.spec.whatwg.org/multipage/webstorage.html#dom-storage-getitem
    return null;
  }

  return STORAGE.get(key);
};

export default {
  hasItem: jest.fn().mockName('localStorage.hasItem'),
  getItem: jest.fn().mockName('localStorage.getItem'),
  setItem: jest.fn().mockName('localStorage.setItem'),

  // Utility to quickly clear the entire localStorage mock.
  __resetAllMocks: function () {
    STORAGE.clear();
    this.hasItem.mockReset();
    this.hasItem.mockImplementation(hasItemImplementation);
    this.getItem.mockReset();
    this.getItem.mockImplementation(getItemImplementation);
    this.setItem.mockReset();
  },

  // Utility to mock a stored value for a key
  __setStoredValueFor: (key, value) => {
    STORAGE.set(key, value);
  },
};
