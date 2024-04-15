export const getAttribute = async ($element, attributeName) => {
  const result = await $element.evaluateHandle((element, attribute) => {
    return element.getAttribute(attribute);
  }, attributeName);

  return result.remoteObject().value;
};

export const getTextContent = async ($element) => {
  const result = await $element.evaluateHandle((element) => {
    return element.textContent;
  });

  return result.remoteObject().value;
};

export const getClipboardValue = async (page) => {
  const result = await page.evaluate(async () =>
    navigator.clipboard.readText(),
  );
  return result;
};

export const getValue = async ($element) => {
  return $element.evaluate((element) => element.value);
};

export const hasClass = async ($element, className) => {
  const result = await $element.evaluateHandle((element, value) => {
    return element.classList.contains(value);
  }, className);

  return result.remoteObject().value;
};

export const isDisabled = async ($element) => {
  const disabledAttribute = await getAttribute($element, 'disabled');
  return disabledAttribute !== null;
};

const isVisibleOnPage = async ($element) => {
  const boundingBox = await $element.boundingBox();
  if (boundingBox === null) {
    return false;
  }

  if (boundingBox.width === 0 && boundingBox.height === 0) {
    return false;
  }

  return true;
};

export const isVisible = async ($element) => {
  const visibleOnPage = await isVisibleOnPage($element);
  if (!visibleOnPage) {
    return false;
  }

  const ariaHidden = await getAttribute($element, 'aria-hidden');
  if (ariaHidden !== null) {
    return false;
  }

  return true;
};

export const isHidden = async ($element) => {
  const visibleOnPage = await isVisibleOnPage($element);
  if (visibleOnPage) {
    return false;
  }

  const ariaHidden = await getAttribute($element, 'aria-hidden');
  if (ariaHidden === null) {
    return false;
  }

  return true;
};

export const isInViewport = async ($element) => {
  const result = await $element.isIntersectingViewport();
  return result;
};
