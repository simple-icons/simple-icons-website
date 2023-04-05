/**
 * @fileoverview
 * Lazy loading of images using an intersection observer.
 */

export default (document) => {
  const images = document.querySelectorAll('img[d-src]');

  if ('IntersectionObserver' in window) {
    const lazyLoad = (target) => {
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('d-src');
              img.onload = () => {
                img.classList.add('ld');
              };
              img.setAttribute('src', src);
              img.removeAttribute('d-src');
              observer.disconnect();
            }
          });
        },
        { threshold: [0], rootMargin: '80px' },
      );

      io.observe(target);
    };
    images.forEach(lazyLoad);
  } else {
    // Browser does not support IntersectionObserver,
    // so we load using the loading=lazy attribute
    for (const img of images) {
      const src = img.getAttribute('d-src');
      img.removeAttribute('d-src');
      img.onload = () => {
        img.classList.add('ld');
      };
      img.setAttribute('loading', 'lazy');
      img.setAttribute('src', src);
    }
  }
};
