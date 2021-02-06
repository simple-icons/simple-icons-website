const PREFIX = 'simple-icons-';

export const STORAGE_KEY_COLOR_SCHEME = PREFIX + 'preferred-color-scheme';
export const STORAGE_KEY_ORDERING = PREFIX + 'preferred-ordering';
export const STORAGE_KEY_HIDE_TEMP_BANNER = PREFIX + 'temporary-banner';

const mockStorage = {
  hasItem() {
    return false;
  },
  getItem() {
    return null;
  },
  setItem() {},
};

export default function newStorage(localStorage) {
  if (!localStorage) {
    return mockStorage;
  }

  return {
    hasItem(key) {
      const value = localStorage.getItem(key);
      return value !== null;
    },
    getItem(key) {
      return localStorage.getItem(key);
    },
    setItem(key, value) {
      return localStorage.setItem(key, value);
    },
  };
}
