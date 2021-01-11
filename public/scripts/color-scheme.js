import { STORAGE_KEY_COLOR_SCHEME } from './storage.js';

const COLOR_SCHEME_DARK = 'dark';
const COLOR_SCHEME_LIGHT = 'light';
const COLOR_SCHEME_SYSTEM = 'system';

const DEFAULT_COLOR_SCHEME = COLOR_SCHEME_SYSTEM;

const CLASS_DARK_MODE = 'dark';
const CLASS_LIGHT_MODE = 'light';

let activeColorScheme = DEFAULT_COLOR_SCHEME;

export default function initColorScheme(
  document,
  storage,
) {
  const $body = document.querySelector('body');
  const $colorSchemeDark = document.getElementById('color-scheme-dark');
  const $colorSchemeLight = document.getElementById('color-scheme-light');
  const $colorSchemeSystem = document.getElementById('color-scheme-system');

  $colorSchemeDark.disabled = false;
  $colorSchemeLight.disabled = false;
  $colorSchemeSystem.disabled = false;

  const storedColorScheme = storage.getItem(STORAGE_KEY_COLOR_SCHEME);
  if (storedColorScheme) {
    selectColorScheme(storedColorScheme);
  } else {
    selectColorScheme(DEFAULT_COLOR_SCHEME);
  }

  $colorSchemeDark.addEventListener('click', (event) => {
    event.preventDefault();
    if (activeColorScheme != COLOR_SCHEME_DARK) {
      selectColorScheme(COLOR_SCHEME_DARK);
      $colorSchemeDark.blur();
    }
  });
  $colorSchemeLight.addEventListener('click', (event) => {
    event.preventDefault();
    if (activeColorScheme != COLOR_SCHEME_LIGHT) {
      selectColorScheme(COLOR_SCHEME_LIGHT);
      $colorSchemeLight.blur();
    }
  });
  $colorSchemeSystem.addEventListener('click', (event) => {
    event.preventDefault();
    if (activeColorScheme != COLOR_SCHEME_SYSTEM) {
      selectColorScheme(COLOR_SCHEME_SYSTEM);
      $colorSchemeSystem.blur();
    }
  });

  function selectColorScheme(selected) {
    if (selected === COLOR_SCHEME_DARK) {
      $body.classList.add(CLASS_DARK_MODE);
      $body.classList.remove(CLASS_LIGHT_MODE);
    } else if (selected === COLOR_SCHEME_LIGHT) {
      $body.classList.add(CLASS_LIGHT_MODE);
      $body.classList.remove(CLASS_DARK_MODE);
    } else {
      $body.classList.remove(
        CLASS_DARK_MODE,
        CLASS_LIGHT_MODE,
      );
    }

    storage.setItem(STORAGE_KEY_COLOR_SCHEME, selected);
    activeColorScheme = selected;
  }
}
