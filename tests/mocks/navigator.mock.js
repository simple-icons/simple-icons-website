export const navigator = {
  clipboard: {
    writeText: jest.fn().mockName('navigator.clipboard.writeText'),
  },

  // Utility to quickly clear the entire localStorage mock.
  __resetAllMocks: function () {
    this.clipboard.writeText.mockReset();
  },
};
