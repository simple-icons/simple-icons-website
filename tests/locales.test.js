import fs from 'node:fs';
import path from 'node:path';
import { getNonDefaultLanguages } from '../scripts/i18n.js';
import PO from 'pofile';

const TARGET_LANGUAGES = Object.keys(await getNonDefaultLanguages());

describe('Translations must be updated', () => {
  it.each(TARGET_LANGUAGES)(
    'Locale %s must have all messages translated',
    (lang) => {
      const poFilePath = path.join('locales', `${lang}.po`);
      const poFileContent = fs.readFileSync(poFilePath, 'utf8');
      const po = PO.parse(poFileContent);
      const poData = po.items.map((item) => [item.msgstr[0], item.obsolete]);

      for (let [msgstr, obsolete] of poData) {
        expect(msgstr).not.toBe('');
        expect(obsolete).toBeFalsy();
      }
    },
  );
});
