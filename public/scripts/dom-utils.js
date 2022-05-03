export const hideElement = ($el) => {
  if ($el) {
    $el.classList.add('hidden');
    $el.setAttribute('aria-hidden', 'true');
  }
};

export const showElement = ($el) => {
  if ($el) {
    $el.classList.remove('hidden');
    $el.removeAttribute('aria-hidden');
  }
};

export const toggleVisibleElement = ($el) => {
  if ($el) {
    $el.classList.toggle('hidden');
    $el.toggleAttribute('aria-hidden');
  }
};

export const sortChildren = ($el, attribute, nFirstChildren) => {
  const sorted = [...$el.children].sort(
    (a, b) =>
      parseInt(a.getAttribute(attribute)) - parseInt(b.getAttribute(attribute)),
  );
  replaceChildren($el, sorted, nFirstChildren);
};

export const replaceChildren = ($el, newChildren, nFirstChildren) => {
  nFirstChildren =
    Math.min(nFirstChildren, newChildren.length) || newChildren.length;
  const firstChildren = newChildren.slice(0, nFirstChildren);
  $el.innerHTML = '';
  firstChildren.forEach((node) => $el.appendChild(node));
  setTimeout(() => {
    newChildren.slice(nFirstChildren).forEach((node) => $el.appendChild(node));
  }, 0);
};

export const addClass = ($el, clazz) => {
  if ($el) {
    $el.classList.add(clazz);
  }
};

export const removeClass = ($el, clazz) => {
  if ($el) {
    $el.classList.remove(clazz);
  }
};

export const toggleClass = ($el, clazz) => {
  if ($el) {
    $el.classList.toggle(clazz);
  }
};
