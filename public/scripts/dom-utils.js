export function hideElement($el) {
  if ($el) {
    $el.classList.add('hidden');
    $el.setAttribute('aria-hidden', 'true');
  }
}

export function showElement($el) {
  if ($el) {
    $el.classList.remove('hidden');
    $el.removeAttribute('aria-hidden');
  }
}
