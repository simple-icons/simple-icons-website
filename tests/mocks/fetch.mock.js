export const newFetchTextMock = (value) => {
  return jest
    .fn()
    .mockName('fetch')
    .mockImplementation((url) => {
      return new Promise((resolve) => {
        resolve({
          text: () => {
            return new Promise((resolve) => {
              resolve(value);
            });
          },
        });
      });
    });
};

export const fetch = newFetchTextMock('');
