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
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/ħ/g, 'h')
      .replace(/ı/g, 'i')
      .replace(/ĸ/g, 'k')
      .replace(/ŀ/g, 'l')
      .replace(/ł/g, 'l')
      .replace(/ß/g, 'ss')
      .replace(/ŧ/g, 't');
  },
};
