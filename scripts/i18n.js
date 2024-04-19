#!/usr/bin/env node
/**
 * @fileoverview
 * Updates the translations of the project, located in the
 * directory locales/
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import PO from 'pofile';
import pugLex from 'pug-lexer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_LANGUAGE = 'en';

const ROOT_DIR = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT_DIR, 'locales');
const INDEX_PATH = path.join(ROOT_DIR, 'public', 'index.pug');
const LANGUAGES_PATH = path.join(LOCALES_DIR, 'languages.json');

export const getLanguagesFile = async () => {
  return JSON.parse(await fs.readFile(LANGUAGES_PATH));
};

export const getLanguages = async () => {
  const result = [];
  const languagesObject = await getLanguagesFile();
  for (const language of Object.keys(languagesObject)) {
    result.push([language, languagesObject[language]]);
  }

  result.sort((a, b) => a[1].localeCompare(b[1]));
  return result;
};

export const getNonDefaultLanguages = async () => {
  const languages = await getLanguages();
  return languages.filter(([code]) => code !== DEFAULT_LANGUAGE);
};

export const loadTranslations = async () => {
  const locales = {};

  const pofiles = await fs.readdir(LOCALES_DIR);
  for (const fname of pofiles) {
    if (!fname.endsWith('.po')) {
      continue;
    }

    const locale = fname.slice(0, -3);
    const pofile = path.join(LOCALES_DIR, fname);
    // eslint-disable-next-line no-await-in-loop
    const pofileContent = await fs.readFile(pofile, 'utf8');
    const po = PO.parse(pofileContent);
    const translations = {};
    for (const item of po.items) {
      translations[item.msgid] = item.msgstr[0];
    }

    locales[locale] = translations;
  }

  const defaultTranslations = Object.keys(Object.values(locales).at(0)).map(
    (msgid) => ({
      [msgid]: msgid,
    }),
  );

  locales.en = defaultTranslations;

  const i18n = (locale) => {
    const translations = locales[locale];
    return (msgid) => translations[msgid] || msgid;
  };

  return i18n;
};

const extractTranslatableStringsFromIndex = (tokens) => {
  const searchTokens = new Set(['interpolated-code', 'attribute', 'code']);

  const msgids = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (
      searchTokens.has(token.type) &&
      typeof token.val === 'string' &&
      token.val.includes('t_(')
    ) {
      const msgid = token.val.match(/(?!t_\(')([^']+)('\))/);
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

  for (const [lang] of nonDefaultLanguages) {
    let po;
    const poPath = path.join(ROOT_DIR, 'locales', `${lang}.po`);

    let _poFileExists = true;
    let _contentChanged = false;
    try {
      // eslint-disable-next-line no-await-in-loop
      await fs.readFile(poPath, 'utf8');
    } catch {
      _poFileExists = false;
    }

    if (_poFileExists) {
      // eslint-disable-next-line no-await-in-loop
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
      // Put obsolete messages at the end
      po.items.sort((a, b) => a.obsolete - b.obsolete);
      const poItems = po.items.map((item) => item.obsolete);
      _contentChanged = !previousPoItems.every(
        (item, i) => item === poItems[i],
      );
    } else {
      po = new PO();
      for (const msgid of msgids) {
        const item = new PO.Item();
        item.msgid = msgid;
        po.items.push(item);
      }

      po.headers = {
        'Project-Id-Version': 'simple-icons-website',
        'Report-Msgid-Bugs-To':
          'https://github.com/simple-icons/simple-icons-website/issues',
        'POT-Creation-Date': currentIso,
        'PO-Revision-Date': currentIso,
        'Last-Translator': '',
        'Language-Team': `${lang} <EMAIL@ADDRESS>`,
        Language: lang,
        'MIME-Version': '1.0',
        'Content-Type': 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding': '8bit',
        'Plural-Forms': 'nplurals=2; plural=(n != 1);',
      };
      _contentChanged = true;
    }

    if (_contentChanged) {
      po.headers['PO-Revision-Date'] = currentIso;
    }

    // eslint-disable-next-line no-await-in-loop
    await fs.writeFile(poPath, po.toString());
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await updateTranslations();
}
