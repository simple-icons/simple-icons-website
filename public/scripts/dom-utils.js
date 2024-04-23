export const hideElement = ($element) => {
  $element.classList.add('hidden');
  $element.setAttribute('aria-hidden', 'true');
};

export const showElement = ($element) => {
  $element.classList.remove('hidden');
  $element.removeAttribute('aria-hidden');
};

export const toggleVisibleElement = ($element) => {
  $element.classList.toggle('hidden');
  $element.toggleAttribute('aria-hidden');
};

export const replaceChildren = ($element, newChildren, nFirstChildren) => {
  nFirstChildren =
    // eslint-disable-next-line unicorn/explicit-length-check
    Math.min(nFirstChildren, newChildren.length) || newChildren.length;
  const firstChildren = newChildren.slice(0, nFirstChildren);
  $element.innerHTML = '';
  for (const node of firstChildren) $element.append(node);
  setTimeout(() => {
    for (const node of newChildren.slice(nFirstChildren)) $element.append(node);
  }, 0);
};

export const sortChildren = (
  $element,
  attribute,
  attributeGetter,
  nFirstChildren,
) => {
  const sorted = [...$element.children].sort((a, b) => {
    const aAttribute = a.getAttribute(attribute);
    const bAttribute = b.getAttribute(attribute);
    // If either element doesn't have the attribute, we don't want to sort it.
    if (aAttribute !== null && bAttribute !== null) {
      return attributeGetter(aAttribute) - attributeGetter(bAttribute);
    }

    return 0;
  });
  replaceChildren($element, sorted, nFirstChildren);
};

export const toggleClass = ($element, clazz) => {
  if ($element) {
    $element.classList.toggle(clazz);
  }
};
