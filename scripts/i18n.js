#!/usr/bin/env node
/**
 * @fileoverview
 * Updates the translations of the project, located in the
 * directory locales/
 */

import fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'node:url';
import pugLex from 'pug-lexer';
import PO from 'pofile';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT_DIR, 'locales');
const INDEX_PATH = path.join(ROOT_DIR, 'public', 'index.pug');
const LANGUAGES_PATH = path.join(LOCALES_DIR, 'languages.json');

export const getLanguages = async () => {
  return JSON.parse(await fs.readFile(LANGUAGES_PATH));
};

export const getNonDefaultLanguages = async () => {
  const languages = await getLanguages();
  delete languages.en;
  return languages;
};

export const loadTranslations = async () => {
  const locales = {};

  const pofiles = await fs.readdir(LOCALES_DIR);
  for (let fname of pofiles) {
    if (!fname.endsWith('.po')) {
      continue;
    }

    const locale = fname.slice(0, -3);
    const pofile = path.join(LOCALES_DIR, fname);
    const po = PO.parse(await fs.readFile(pofile, 'utf8'));
    const translations = {};
    for (let item of po.items) {
      translations[item.msgid] = item.msgstr[0];
    }
    locales[locale] = translations;
  }

  const defaultTranslations = {};
  for (let msgid in locales[Object.keys(locales)[0]]) {
    defaultTranslations[msgid] = msgid;
  }
  locales.en = defaultTranslations;

  const i18n = (locale) => {
    const translations = locales[locale];
    return (msgid) => translations[msgid] || msgid;
  };

  return i18n;
};

const extractTranslatableStringsFromIndex = (tokens) => {
  const searchTokens = ['interpolated-code', 'attribute', 'code'];

  const msgids = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (
      searchTokens.includes(token.type) &&
      typeof token.val === 'string' &&
      token.val.includes('t_(')
    ) {
      let msgid = token.val.match(/(?!t_\(')([^']+)('\))/);
      msgids.push(msgid[1]);
    }
    i++;
  }
  return msgids;
};

export const updateTranslations = async () => {
  const index = await fs.readFile(INDEX_PATH, 'utf8');
  const msgids = extractTranslatableStringsFromIndex(pugLex(index));
  const currentIso = new Date().toISOString();
  const nonDefaultLanguages = await getNonDefaultLanguages();

  for (const lang in nonDefaultLanguages) {
    let po;
    const poPath = path.join(ROOT_DIR, 'locales', `${lang}.po`);

    let _poFileExists = true,
      _contentChanged = false;
    try {
      await fs.readFile(poPath, 'utf8');
    } catch (err) {
      _poFileExists = false;
    }
    if (!_poFileExists) {
      po = new PO();
      for (const msgid of msgids) {
        const item = new PO.Item();
        item.msgid = msgid;
        po.items.push(item);
      }

      po.headers = {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding': '8bit',
        'Plural-Forms': 'nplurals=2; plural=(n != 1);',
        'Language-Team': `${lang} <EMAIL@ADDRESS>`,
        'Last-Translator': 'FULL NAME <EMAIL@ADDRESS>',
        'Report-Msgid-Bugs-To':
          'https://github.com/simple-icons/simple-icons-website/issues',
        Language: lang,
        'POT-Creation-Date': currentIso,
        'MIME-Version': '1.0',
        'Project-Id-Version': 'simple-icons-website',
      };
      _contentChanged = true;
    } else {
      const poContent = await fs.readFile(poPath, 'utf8');
      po = PO.parse(poContent);

      for (const msgid of msgids) {
        const existentItem = po.items.find((item) => item.msgid === msgid);
        if (!existentItem) {
          const item = new PO.Item();
          item.msgid = msgid;
          po.items.push(item);
          _contentChanged = true;
        } else if (existentItem.obsolete) {
          existentItem.obsolete = false;
          _contentChanged = true;
        }
      }

      for (const item of po.items) {
        if (!msgids.includes(item.msgid)) {
          item.obsolete = true;
          _contentChanged = true;
        }
      }

      const previousPoItems = po.items.map((item) => item.obsolete);
      // put obsolete messages at the end
      po.items.sort((a, b) => a.obsolete - b.obsolete);
      const poItems = po.items.map((item) => item.obsolete);
      _contentChanged = !previousPoItems.every(
        (item, index) => item === poItems[index],
      );
    }

    if (_contentChanged) {
      po.headers['PO-Revision-Date'] = currentIso;
    }

    await fs.writeFile(poPath, po.toString());
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateTranslations();
}
