export const localStorageMock = {
  getItem: jest.fn().mockName('localStorage.getItem'),
  setItem: jest.fn().mockName('localStorage.setItem'),

  // Utility to quickly clear the entire localStorage mock.
  __clearAllMocks: function () {
    this.getItem.mockClear();
    this.setItem.mockClear();
  },
};
