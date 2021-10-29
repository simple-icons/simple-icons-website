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
      .toLowerCase()
      .replace(/đ/g, 'd')
      .replace(/ħ/g, 'h')
      .replace(/ı/g, 'i')
      .replace(/ĸ/g, 'k')
      .replace(/ŀ/g, 'l')
      .replace(/ł/g, 'l')
      .replace(/ß/g, 'ss')
      .replace(/ŧ/g, 't')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  },
  QUERY_PARAMETER: 'q',
  COLOR_PARAMETER: 'c',
  ORDER_PARAMETER: 'o',
  paramFromURL: function (location, parameter) {
    const results = new URLSearchParams(location.search);
    return results ? results.get(parameter) : '';
  },
  setParameterInURL: function (document, history, paramName, paramValue) {
    const url = new URL(document.location.href);
    if (paramValue) url.searchParams.set(paramName, paramValue);
    history.replaceState(null, '', url.href);
  },

  initControlButton: function (document, id, value, fn) {
    const $button = document.getElementById(id);
    $button.disabled = false;
    $button.addEventListener('click', (event) => {
      event.preventDefault();
      fn(value);
    });
  },
};
