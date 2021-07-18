const {
  decodeURIComponent,
  debounce,
  normalizeSearchTerm,
} = require('../public/scripts/utils.js');

describe('::decodeURIComponent', () => {
  it('normal string', () => {
    const input = 'foobar';
    const result = decodeURIComponent(input);
    expect(result).toEqual(input);
  });

  it.each([
    ['%3Ffoo%3Dbar', '?foo=bar'],
    ['Let%E2%80%99s%20Encrypt', 'Let’s Encrypt'],
  ])('URI encoded component (%s)', (input, output) => {
    const result = decodeURIComponent(input);
    expect(result).toEqual(output);
  });
});

describe('::debounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('calls the debounced function only once', (done) => {
    const spy = jest.fn();
    const debouncedImmediateSpy = debounce(spy, 1000, true);
    debouncedImmediateSpy(1);
    debouncedImmediateSpy(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);

    spy.mockReset();
    const debouncedDelayedSpy = debounce(spy, 1000, false);

    debouncedDelayedSpy(1);
    debouncedDelayedSpy(2);
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(2);
    done();
  });

  it('can call the debounced function multiple times', (done) => {
    const spy = jest.fn();
    const debouncedImmediateSpy = debounce(spy, 1000, true);

    debouncedImmediateSpy();
    jest.runAllTimers();
    debouncedImmediateSpy();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(2);
    done();
  });

  afterAll(() => {
    jest.useFakeTimers();
  });
});

describe('::normalizeSearchTerm', () => {
  it('normalized string', () => {
    const input = 'foobar';
    const result = normalizeSearchTerm(input);
    expect(result).toEqual(input);
  });

  it('capitalized string', () => {
    const input = 'FooBar';
    const result = normalizeSearchTerm(input);
    expect(result).toEqual(input.toLowerCase());
  });

  it.each([
    ['àáâãä', 'aaaaa'],
    ['çčć', 'ccc'],
    ['èéêë', 'eeee'],
    ['ìíîï', 'iiii'],
    ['ñňń', 'nnn'],
    ['òóôõö', 'ooooo'],
    ['šś', 'ss'],
    ['ùúûü', 'uuuu'],
    ['ýÿ', 'yy'],
    ['žź', 'zz'],
    ['đħıĸŀłßŧ', 'dhikllsst'],
  ])('accented latin characters (%s)', (input, output) => {
    const result = normalizeSearchTerm(input);
    expect(result).toEqual(output);
  });
});
