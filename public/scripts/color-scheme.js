import { STORAGE_KEY_COLOR_SCHEME } from './storage.js';
import {
  paramFromURL,
  COLOR_PARAMETER,
  setParameterInURL,
  initControlButton,
} from './utils.js';

const COLOR_SCHEME_DARK = 'dark';
const COLOR_SCHEME_LIGHT = 'light';
const COLOR_SCHEME_SYSTEM = 'system';

const DEFAULT_COLOR_SCHEME = COLOR_SCHEME_SYSTEM;

export default function initColorScheme(document, history, storage) {
  let activeColorScheme = DEFAULT_COLOR_SCHEME;

  const $body = document.querySelector('body');

  function selectColorScheme(selected, persistLocally = true) {
    if (selected === activeColorScheme) {
      return;
    }

    $body.classList.remove(
      COLOR_SCHEME_DARK,
      COLOR_SCHEME_LIGHT,
      COLOR_SCHEME_SYSTEM,
    );

    $body.classList.add(selected);

    activeColorScheme = selected;
    if (persistLocally) storage.setItem(STORAGE_KEY_COLOR_SCHEME, selected);
  }

  initControlButton(
    document,
    'color-scheme-dark',
    COLOR_SCHEME_DARK,
    selectColorScheme,
  );
  initControlButton(
    document,
    'color-scheme-light',
    COLOR_SCHEME_LIGHT,
    selectColorScheme,
  );
  initControlButton(
    document,
    'color-scheme-system',
    COLOR_SCHEME_SYSTEM,
    selectColorScheme,
  );

  const color = paramFromURL(document.location, COLOR_PARAMETER);
  if (color) {
    selectColorScheme(color, false);
  } else if (storage.hasItem(STORAGE_KEY_COLOR_SCHEME)) {
    const storedColorScheme = storage.getItem(STORAGE_KEY_COLOR_SCHEME);
    selectColorScheme(storedColorScheme);
  }
}
