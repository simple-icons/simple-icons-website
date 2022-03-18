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

module.exports = {
  decodeURIComponent: decodeURIComponent,
  debounce: function (func, wait, immediate) {
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

    return function () {
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
  },
  normalizeSearchTerm: function (value) {
    return value
      .replace(
        NORMALIZE_SEARCH_TERM_CHARS_REGEX,
        (char) => NORMALIZE_SEARCH_TERM_REPLACEMENTS[char],
      )
      .normalize('NFD')
      .replace(NORMALIZE_SEARCH_TERM_RANGE_REGEX, '');
  },
  iconHrefToSlug: function (href) {
    return /icons\/(.+)\.svg$/.exec(href)[1];
  },
};
