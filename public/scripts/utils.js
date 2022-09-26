export const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result; // eslint-disable-line one-var

  const later = () => {
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
};

export const iconHrefToSlug = (href) => /icons\/(.+)\.svg$/.exec(href)[1];
