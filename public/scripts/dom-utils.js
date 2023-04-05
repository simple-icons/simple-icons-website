export const hideElement = ($el) => {
  $el.classList.add('hidden');
  $el.setAttribute('aria-hidden', 'true');
};

export const showElement = ($el) => {
  $el.classList.remove('hidden');
  $el.removeAttribute('aria-hidden');
};

export const toggleVisibleElement = ($el) => {
  $el.classList.toggle('hidden');
  $el.toggleAttribute('aria-hidden');
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

export const sortChildren = (
  $el,
  attribute,
  attributeGetter,
  nFirstChildren,
) => {
  const sorted = [...$el.children].sort((a, b) => {
    const aAttr = a.getAttribute(attribute);
    const bAttr = b.getAttribute(attribute);
    // If either element doesn't have the attribute, we don't want to sort it.
    if (aAttr !== null && bAttr !== null) {
      return attributeGetter(aAttr) - attributeGetter(bAttr);
    }
    return 0;
  });
  replaceChildren($el, sorted, nFirstChildren);
};

export const toggleClass = ($el, clazz) => {
  if ($el) {
    $el.classList.toggle(clazz);
  }
};
