/**
 * @fileoverview
 * Lazy loading of images using an intersection observer.
 */

export default function iObserver(document) {
  const images = document.querySelectorAll('img[d-src]');

  if ('IntersectionObserver' in window) {
    const lazyLoad = (target) => {
      const io = new IntersectionObserver(
        (entries, observer) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const img = entry.target;
              const source = img.getAttribute('d-src');
              img.addEventListener('load', () => {
                img.classList.add('ld');
              });

              img.setAttribute('src', source);
              img.removeAttribute('d-src');
              observer.disconnect();
            }
          }
        },
        {threshold: [0], rootMargin: '80px'},
      );

      io.observe(target);
    };

    for (const image of images) {
      lazyLoad(image);
    }
  } else {
    // Browser does not support IntersectionObserver,
    // so we load using the loading=lazy attribute
    for (const img of images) {
      const source = img.getAttribute('d-src');
      img.removeAttribute('d-src');
      img.addEventListener('load', () => {
        img.classList.add('ld');
      });

      img.setAttribute('loading', 'lazy');
      img.setAttribute('src', source);
    }
  }
}
