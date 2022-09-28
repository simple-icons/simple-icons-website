import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import PO from 'pofile';
import { DEFAULT_LANGUAGE } from '../scripts/i18n.js';

const ISO369_1_OR_IETF = '[a-z]{2}(-[A-Z]{2})?';
const ISO369_1_OR_IETF_REGEX = new RegExp(`^${ISO369_1_OR_IETF}$`);

describe('Translations must be updated', () => {
  const languages = Object.keys(
    JSON.parse(readFileSync(path.join('locales', 'languages.json'))),
  );

  const targetLanguages = languages.filter((lang) => lang !== DEFAULT_LANGUAGE);

  it.each(languages)(
    'locale %s must be in ISO 369-1 or IETF format',
    (language) => {
      expect(language).toMatch(ISO369_1_OR_IETF_REGEX);
    },
  );

  it.each(targetLanguages)(
    'Locale %s must have all messages translated',
    async (lang) => {
      const poFilePath = path.join('locales', `${lang}.po`);
      const poFileContent = await fs.readFile(poFilePath, 'utf8');
      const po = PO.parse(poFileContent);
      const poData = po.items.map((item) => [item.msgstr[0], item.obsolete]);

      for (const [msgstr, obsolete] of poData) {
        expect(msgstr).not.toBe('');
        expect(obsolete).toBeFalsy();
      }
    },
  );

  it.each(targetLanguages)(
    'File locales/%s.po must have the correct metadata headers',
    async (lang) => {
      const poFilePath = path.join('locales', `${lang}.po`);
      const poFileContent = await fs.readFile(poFilePath, 'utf8');
      const po = PO.parse(poFileContent);
      expect(po.headers['Project-Id-Version']).toBe('simple-icons-website');
      expect(po.headers['Last-Translator']).toMatch(
        new RegExp(
          '^(([^ ]+ <https://[^ >]+>)|(@simple-icons/maintainers <https://github\\.com/simple-icons>))$',
        ),
      );
      expect(po.headers['Project-Id-Version']).toBe('simple-icons-website');
      expect(po.headers['Language-Team']).toMatch(
        new RegExp(`^${ISO369_1_OR_IETF} <https://github\\.com/simple-icons>$`),
      );
      expect(po.headers.Language).toBe(lang);
      expect(po.headers['Content-Type']).toBe('text/plain; charset=UTF-8');
      expect(po.headers['Content-Transfer-Encoding']).toBe('8bit');
      expect(po.headers['MIME-Version']).toBe('1.0');
    },
  );
});
