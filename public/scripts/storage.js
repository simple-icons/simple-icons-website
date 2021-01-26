export const STORAGE_KEY_COLOR_SCHEME = 'preferred-color-scheme';
export const STORAGE_KEY_ORDERING = 'preferred-ordering';
export const STORAGE_HIDE_TEMP_BANNER = 'temporary-banner';

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
