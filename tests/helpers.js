async function isVisibleOnPage($el) {
  const boundingBox = await $el.boundingBox();
  if (boundingBox === null) {
    return false;
  }

  if (boundingBox.width === 0 && boundingBox.height === 0) {
    return false;
  }

  return true;
}

async function getAttribute($el, attributeName) {
  const result = await $el.evaluateHandle((el, attribute) => {
    return el.getAttribute(attribute);
  }, attributeName);

  return result._remoteObject.value;
}

async function getTextContent($el, attributeName) {
  const result = await $el.evaluateHandle((el, attribute) => {
    return el.textContent;
  });

  return result._remoteObject.value;
}

async function getClipboardValue(page) {
  const result = await page.evaluate(() => navigator.clipboard.readText());
  return result;
}

async function getValue($el) {
  return await $el.evaluate((el) => el.value);
}

async function hasClass($el, className) {
  const result = await $el.evaluateHandle((el, value) => {
    return el.classList.contains(value);
  }, className);

  return result._remoteObject.value;
}

async function isDisabled($el) {
  const disabledAttribute = await getAttribute($el, 'disabled');
  return disabledAttribute !== null;
}

async function isHidden($el) {
  const visibleOnPage = await isVisibleOnPage($el);
  if (visibleOnPage) {
    return false;
  }

  const ariaHidden = await getAttribute($el, 'aria-hidden');
  if (ariaHidden === null) {
    return false;
  }

  return true;
}

async function isInViewport($el) {
  const result = await $el.isIntersectingViewport();
  return result;
}

async function isVisible($el) {
  const visibleOnPage = await isVisibleOnPage($el);
  if (!visibleOnPage) {
    return false;
  }

  const ariaHidden = await getAttribute($el, 'aria-hidden');
  if (ariaHidden !== null) {
    return false;
  }

  return true;
}

module.exports = {
  getAttribute,
  getTextContent,
  getClipboardValue,
  getValue,
  hasClass,
  isDisabled,
  isHidden,
  isInViewport,
  isVisible,
};
