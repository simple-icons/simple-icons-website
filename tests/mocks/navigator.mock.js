export const navigatorMock = {
  clipboard: {
    writeText: jest.fn().mockName('navigator.clipboard.writeText'),
  },

  // Utility to quickly clear the entire localStorage mock.
  __clearAllMocks: function () {
    this.clipboard.writeText.mockClear();
  },
};
