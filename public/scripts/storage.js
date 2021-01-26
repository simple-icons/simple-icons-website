const PREFIX = 'simple-icons-';

export const STORAGE_KEY_COLOR_SCHEME = PREFIX + 'preferred-color-scheme';
export const STORAGE_KEY_ORDERING = PREFIX + 'preferred-ordering';

const mockStorage = {
  getItem() {},
  setItem() {},
};

export default function newStorage(localStorage) {
  if (!localStorage) {
    return mockStorage;
  }

  return {
    getItem(key) {
      return localStorage.getItem(key);
    },
    setItem(key, value) {
      return localStorage.setItem(key, value);
    },
  };
}
