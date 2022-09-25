import fs from 'node:fs';
import path from 'node:path';
import { LANGUAGES, loadTranslations } from '../scripts/i18n.js';
import PO from 'pofile';

const i18n = loadTranslations();
describe.each(LANGUAGES)(
  'Locale %s must have all messages translated',
  (lang) => {
    const t_ = i18n(lang);
    it.each(Object.keys(t_.translations))('%s', (key) => {
      expect(t_.translations[key]).not.toEqual('');
    });
  },
);

describe.each(LANGUAGES)(
  'Locale %s must not have obsolete messages',
  (lang) => {
    const poFilePath = path.join('locales', `${lang}.po`);
    const po = PO.parse(fs.readFileSync(poFilePath, 'utf8'));
    it.each(po.items, '%s', (item) => {
      expect(item.obsolete).toBeFalsy();
    });
  },
);
