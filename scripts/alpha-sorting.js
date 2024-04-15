/**
 * @fileoverview
 * Alphabetical sorting for SimpleIcons icons.
 */

/**
 * Sort icons alphabetically by title and slug.
 * @param {Object} icons SimpleIcons icons.
 */
export default function alphaSorting(icons) {
  return Object.values(icons).sort((icon1, icon2) => {
    const comp = icon1.title.localeCompare(icon2.title);
    return comp === 0 ? icon1.slug.localeCompare(icon2.slug) : comp;
  });
}
