import { STORAGE_KEY_COLOR_SCHEME } from './storage.js';

const COLOR_SCHEME_DARK = 'dark';
const COLOR_SCHEME_LIGHT = 'light';
const COLOR_SCHEME_SYSTEM = 'system';

const DEFAULT_COLOR_SCHEME = COLOR_SCHEME_SYSTEM;

const CLASS_DARK_MODE = 'dark';
const CLASS_LIGHT_MODE = 'light';

export default function initColorScheme(document, storage) {
  let activeColorScheme = DEFAULT_COLOR_SCHEME;

  const $body = document.querySelector('body');
  const $colorSchemeDark = document.getElementById('color-scheme-dark');
  const $colorSchemeLight = document.getElementById('color-scheme-light');
  const $colorSchemeSystem = document.getElementById('color-scheme-system');

  $colorSchemeDark.disabled = false;
  $colorSchemeLight.disabled = false;
  $colorSchemeSystem.disabled = false;

  if (storage.hasItem(STORAGE_KEY_COLOR_SCHEME)) {
    const storedColorScheme = storage.getItem(STORAGE_KEY_COLOR_SCHEME);
    selectColorScheme(storedColorScheme);
  }

  $colorSchemeDark.addEventListener('click', () => {
    selectColorScheme(COLOR_SCHEME_DARK);
  });
  $colorSchemeLight.addEventListener('click', () => {
    selectColorScheme(COLOR_SCHEME_LIGHT);
  });
  $colorSchemeSystem.addEventListener('click', () => {
    selectColorScheme(COLOR_SCHEME_SYSTEM);
  });

  function selectColorScheme(selected) {
    if (selected === activeColorScheme) {
      return;
    }

    if (selected === COLOR_SCHEME_DARK) {
      $body.classList.add(CLASS_DARK_MODE);
      $body.classList.remove(CLASS_LIGHT_MODE);
    } else if (selected === COLOR_SCHEME_LIGHT) {
      $body.classList.add(CLASS_LIGHT_MODE);
      $body.classList.remove(CLASS_DARK_MODE);
    } else {
      $body.classList.remove(CLASS_DARK_MODE, CLASS_LIGHT_MODE);
    }

    storage.setItem(STORAGE_KEY_COLOR_SCHEME, selected);
    activeColorScheme = selected;
  }
}
