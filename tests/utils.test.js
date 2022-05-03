import { jest } from '@jest/globals';
import { debounce, iconHrefToSlug } from '../public/scripts/utils.js';

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

describe('::iconHrefToSlug', () => {
  it.each([
    ['./icons/simpleicons.svg', 'simpleicons'],
    ['/simple-icons-website/icons/foobarbaz.svg', 'foobarbaz'],
    ['./simple-icons-website/icons/foobarbaz.svg', 'foobarbaz'],
  ])('accented latin characters (%s)', (input, output) => {
    const result = iconHrefToSlug(input);
    expect(result).toEqual(output);
  });
});
