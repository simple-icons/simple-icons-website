import fs from 'node:fs';
import path from 'node:path';
import PO from 'pofile';
import { DEFAULT_LANGUAGE } from '../scripts/i18n.js';

describe('Translations must be updated', () => {
  const TARGET_LANGUAGES = Object.keys(
    JSON.parse(fs.readFileSync(path.join('locales', 'languages.json'))),
  );

  it.each(TARGET_LANGUAGES)(
    'locale %s must be in ISO 369-1 or IETF format',
    (language) => {
      expect(language).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
    },
  );

  it.each(TARGET_LANGUAGES.filter((lang) => lang !== DEFAULT_LANGUAGE))(
    'Locale %s must have all messages translated',
    (lang) => {
      const poFilePath = path.join('locales', `${lang}.po`);
      const poFileContent = fs.readFileSync(poFilePath, 'utf8');
      const po = PO.parse(poFileContent);
      const poData = po.items.map((item) => [item.msgstr[0], item.obsolete]);

      for (const [msgstr, obsolete] of poData) {
        expect(msgstr).not.toBe('');
        expect(obsolete).toBeFalsy();
      }
    },
  );
});
