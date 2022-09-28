const TITLE_TO_SLUG_REPLACEMENTS = {
  '+': 'plus',
  '.': 'dot',
  '&': 'and',
  đ: 'd',
  ħ: 'h',
  ı: 'i',
  ĸ: 'k',
  ŀ: 'l',
  ł: 'l',
  ß: 'ss',
  ŧ: 't',
};

const TITLE_TO_SLUG_CHARS_REGEX = RegExp(
  `[${Object.keys(TITLE_TO_SLUG_REPLACEMENTS).join('')}]`,
  'g',
);

const TITLE_TO_SLUG_RANGE_REGEX = /[^a-z0-9]/g;

/**
 * Converts a brand title into a slug/filename.
 * @param {String} title The title to convert
 */
const titleToSlug = (title) =>
  title
    .toLowerCase()
    .replace(
      TITLE_TO_SLUG_CHARS_REGEX,
      (char) => TITLE_TO_SLUG_REPLACEMENTS[char],
    )
    .normalize('NFD')
    .replace(TITLE_TO_SLUG_RANGE_REGEX, '');

const SIMPLE_ICONS_DATA = {};

export const getIconData = (slug) => SIMPLE_ICONS_DATA[slug];

const initIconsData = async () => {
  const [iconsDataResponse, icons] = await Promise.all([
    fetch('/simple-icons.json'),
    import('simple-icons/icons'),
  ]);
  const iconsData = await iconsDataResponse.json();

  for (const iconData of iconsData.icons) {
    const slug = iconData.slug || titleToSlug(iconData.title);
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
    const icon = icons[`si${capitalizedSlug}`];
    if (iconData.aliases) {
      icon.aliases = iconData.aliases;
    }
    SIMPLE_ICONS_DATA[slug] = icon;
  }
};

export default initIconsData;
