import newStorage from '../public/scripts/storage.js';
import localStorage from './mocks/local-storage.mock.js';

describe('Storage', () => {
  beforeEach(() => localStorage.__resetAllMocks());

  it('returns something if input is not defined', () => {
    const result = newStorage(undefined);
    expect(result.getItem).toBeInstanceOf(Function);
    expect(result.setItem).toBeInstanceOf(Function);
  });

  it('wraps the provided `localStorage`', () => {
    const result = newStorage(localStorage);

    localStorage.getItem.mockReturnValue('bar');
    const item = result.getItem('foo');
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(item).toBe('bar');

    localStorage.__resetAllMocks();

    result.setItem('foo', 'bar');
    expect(localStorage.getItem).toHaveBeenCalledTimes(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
