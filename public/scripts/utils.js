export const debounce = (function_, wait, immediate) => {
  // eslint-disable-next-line one-var
  let timeout, arguments_, context, timestamp, result;

  const later = () => {
    const last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = function_.apply(context, arguments_);
        // eslint-disable-next-line no-multi-assign
        if (!timeout) context = arguments_ = null;
      }
    }
  };

  return function () {
    // eslint-disable-next-line unicorn/no-this-assignment
    context = this;
    // eslint-disable-next-line prefer-rest-params
    arguments_ = arguments;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    timeout ||= setTimeout(later, wait);
    if (callNow) {
      result = function_.apply(context, arguments_);
      // eslint-disable-next-line no-multi-assign
      context = arguments_ = null;
    }

    return result;
  };
};

export const iconHrefToSlug = (href) => /icons\/(.+)\.svg$/.exec(href)[1];
