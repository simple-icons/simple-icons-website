export function hideElement($el) {
  $el.classList.add('hidden');
  $el.setAttribute('aria-hidden', 'true');
}

export function showElement($el) {
  $el.classList.remove('hidden');
  $el.removeAttribute('aria-hidden');
}
