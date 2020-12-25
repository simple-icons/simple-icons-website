module.exports = {
  debounce: function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
      var last = +new Date - timestamp;

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
      timestamp = +new Date;
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  },
  normalizeSearchTerm: function(value) {
    return value.toLowerCase()
      .replace(/à|á|â|ã|ä/g, "a")
      .replace(/ç|č|ć/g, "c")
      .replace(/è|é|ê|ë/g, "e")
      .replace(/ì|í|î|ï/g, "i")
      .replace(/ñ|ň|ń/g, "n")
      .replace(/ò|ó|ô|õ|ö/g, "o")
      .replace(/š|ś/g, "s")
      .replace(/ù|ú|û|ü/g, "u")
      .replace(/ý|ÿ/g, "y")
      .replace(/ž|ź/g, "z");
  },
}

// export function debounce(func, wait, immediate) {
//   var timeout, args, context, timestamp, result;

//   var later = function () {
//     var last = +new Date - timestamp;

//     if (last < wait && last >= 0) {
//       timeout = setTimeout(later, wait - last);
//     } else {
//       timeout = null;
//       if (!immediate) {
//         result = func.apply(context, args);
//         if (!timeout) context = args = null;
//       }
//     }
//   };

//   return function () {
//     context = this;
//     args = arguments;
//     timestamp = +new Date;
//     var callNow = immediate && !timeout;
//     if (!timeout) timeout = setTimeout(later, wait);
//     if (callNow) {
//       result = func.apply(context, args);
//       context = args = null;
//     }

//     return result;
//   };
// }

// export function normalizeSearchTerm(value) {
//   return value.toLowerCase()
//     .replace(/à|á|â|ã|ä/g, "a")
//     .replace(/ç|č|ć/g, "c")
//     .replace(/è|é|ê|ë/g, "e")
//     .replace(/ì|í|î|ï/g, "i")
//     .replace(/ñ|ň|ń/g, "n")
//     .replace(/ò|ó|ô|õ|ö/g, "o")
//     .replace(/š|ś/g, "s")
//     .replace(/ù|ú|û|ü/g, "u")
//     .replace(/ý|ÿ/g, "y")
//     .replace(/ž|ź/g, "z");
// }