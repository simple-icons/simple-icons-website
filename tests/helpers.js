export const getAttribute = async ($el, attributeName) => {
  const result = await $el.evaluateHandle((el, attribute) => {
    return el.getAttribute(attribute);
  }, attributeName);

  return result.remoteObject().value;
};

export const getTextContent = async ($el) => {
  const result = await $el.evaluateHandle((el) => {
    return el.textContent;
  });

  return result.remoteObject().value;
};

export const getClipboardValue = async (page) => {
  const result = await page.evaluate(
    async () => await navigator.clipboard.readText(),
  );
  return result;
};

export const getValue = async ($el) => {
  return await $el.evaluate((el) => el.value);
};

export const hasClass = async ($el, className) => {
  const result = await $el.evaluateHandle((el, value) => {
    return el.classList.contains(value);
  }, className);

  return result.remoteObject().value;
};

export const isDisabled = async ($el) => {
  const disabledAttribute = await getAttribute($el, 'disabled');
  return disabledAttribute !== null;
};

const isVisibleOnPage = async ($el) => {
  const boundingBox = await $el.boundingBox();
  if (boundingBox === null) {
    return false;
  }

  if (boundingBox.width === 0 && boundingBox.height === 0) {
    return false;
  }

  return true;
};

export const isVisible = async ($el) => {
  const visibleOnPage = await isVisibleOnPage($el);
  if (!visibleOnPage) {
    return false;
  }

  const ariaHidden = await getAttribute($el, 'aria-hidden');
  if (ariaHidden !== null) {
    return false;
  }

  return true;
};

export const isHidden = async ($el) => {
  const visibleOnPage = await isVisibleOnPage($el);
  if (visibleOnPage) {
    return false;
  }

  const ariaHidden = await getAttribute($el, 'aria-hidden');
  if (ariaHidden === null) {
    return false;
  }

  return true;
};

export const isInViewport = async ($el) => {
  const result = await $el.isIntersectingViewport();
  return result;
};
