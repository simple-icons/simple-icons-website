const NORMALIZE_SEARCH_TERM_REPLACEMENTS = {
  đ: 'd',
  ħ: 'h',
  ı: 'i',
  ĸ: 'k',
  ŀ: 'l',
  ł: 'l',
  ß: 'ss',
  ŧ: 't',
};

const NORMALIZE_SEARCH_TERM_CHARS_REGEX = RegExp(
  Object.keys(NORMALIZE_SEARCH_TERM_REPLACEMENTS).join('|'),
  'g',
);
const NORMALIZE_SEARCH_TERM_RANGE_REGEX = RegExp('[\u0300-\u036f]', 'g');

// provided by browsers, exported for tests
export const decodeURIComponent = decodeURIComponent;

export const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result;

  const later = function () {
    const last = +new Date() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return () => {
    context = this;
    args = arguments;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export const normalizeSearchTerm = (value) =>
  value
    .replace(
      NORMALIZE_SEARCH_TERM_CHARS_REGEX,
      (char) => NORMALIZE_SEARCH_TERM_REPLACEMENTS[char],
    )
    .normalize('NFD')
    .replace(NORMALIZE_SEARCH_TERM_RANGE_REGEX, '');

export const iconHrefToSlug = (href) => /icons\/(.+)\.svg$/.exec(href)[1]
