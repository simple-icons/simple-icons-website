#!/usr/bin/env node
/**
 * @fileoverview
 * Updates the simple-icons dependency to the latest version.  Upon success, the
 * new simple-icons dependency version is outputted.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PACKAGE_JSON_FILE = path.resolve(__dirname, '..', 'package.json');

const getManifest = async () => {
  return JSON.parse(await fs.readFile(PACKAGE_JSON_FILE, 'utf8'));
};

const main = async () => {
  try {
    const manifestBefore = await getManifest();
    const versionBefore = manifestBefore.dependencies['simple-icons'];

    execSync('npm uninstall simple-icons', { stdio: 'ignore' });
    execSync('npm install --save-exact simple-icons', { stdio: 'ignore' });

    const manifestAfter = await getManifest();
    const versionAfter = manifestAfter.dependencies['simple-icons'];

    if (versionBefore === versionAfter) {
      throw new Error('Simple icons does not need to be updated');
    }

    console.info(versionAfter);
  } catch (error) {
    console.error('Failed to update simple-icons to latest version:', error);
    process.exit(1);
  }
};

main();
