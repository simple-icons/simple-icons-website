import fs from 'node:fs';
import path from 'node:path';
import PO from 'pofile';

describe('Translations must be updated', () => {
  const TARGET_LANGUAGES = fs
    .readdirSync('locales')
    .filter((fname) => fname.endsWith('.po'))
    .map((fname) => fname.slice(0, -3));

  it.each(TARGET_LANGUAGES)(
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
