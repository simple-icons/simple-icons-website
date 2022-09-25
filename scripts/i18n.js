#!/usr/bin/env node
/**
 * @fileoverview
 * Updates the translations of the project, located in the
 * directory locales/
 */

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import pugLex from 'pug-lexer';
import PO from 'pofile';

export const LANGUAGES = ['es', 'fr'];

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT_DIR, 'locales');
const INDEX_PATH = path.join(ROOT_DIR, 'public', 'index.pug');

export const loadTranslations = () => {
  const locales = {};
  const pofiles = fsSync.readdirSync(LOCALES_DIR);
  for (let fname of pofiles) {
    if (fname.endsWith('.po')) {
      const locale = fname.slice(0, -3);
      const pofile = path.join(LOCALES_DIR, fname);
      const po = PO.parse(fsSync.readFileSync(pofile, 'utf8'));
      const translations = {};
      for (let item of po.items) {
        translations[item.msgid] = item.msgstr[0];
      }
      locales[locale] = translations;

      if (locales.en === undefined) {
        const defaultTranslations = {};
        for (let item of po.items) {
          defaultTranslations[item.msgid] = item.msgid;
        }
        locales.en = defaultTranslations;
      }
    }
  }

  const i18n = (locale) => {
    const translations = locales[locale];
    const func = (msgid) => translations[msgid] || msgid;
    func.translations = translations;
    return func;
  };

  return i18n;
};

const extractTranslatableStringsFromIndex = (tokens) => {
  const searchTokens = ['interpolated-code', 'attribute', 'code'];

  const msgids = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (searchTokens.includes(token.type)) {
      if (typeof token.val === 'string' && token.val.includes('t_(')) {
        let msgid = token.val.match(/(?!t_\(')([^']+)('\))/);
        msgids.push(msgid[1]);
      }
    }
    i++;
  }
  return msgids;
};

export const updateTranslations = async () => {
  const index = await fs.readFile(INDEX_PATH, 'utf8');
  const msgids = extractTranslatableStringsFromIndex(pugLex(index));
  const currentIso = new Date().toISOString();

  for (const lang of LANGUAGES) {
    let po;
    const poPath = path.join(ROOT_DIR, 'locales', `${lang}.po`);
    if (!fsSync.existsSync(poPath)) {
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
        'PO-Revision-Date': currentIso,
        'MIME-Version': '1.0',
      };
    } else {
      const poContent = await fs.readFile(poPath, 'utf8');
      po = PO.parse(poContent);
      for (const msgid of msgids) {
        const existentItem = po.items.find((item) => item.msgid === msgid);
        if (!existentItem) {
          const item = new PO.Item();
          item.msgid = msgid;
          po.items.push(item);
        } else if (existentItem.obsolete) {
          existentItem.obsolete = false;
        }
      }

      for (const item of po.items) {
        if (!msgids.includes(item.msgid)) {
          item.obsolete = true;
        }
      }

      po.items.sort((a, b) => a.obsolete - b.obsolete);
      po.headers['PO-Revision-Date'] = currentIso;
    }
    await fs.writeFile(poPath, po.toString());
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateTranslations();
}
