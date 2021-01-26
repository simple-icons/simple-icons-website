#!/usr/bin/env node
/**
 * @fileoverview
 * Updates the simple-icons dependency to the latest version.  Upon success, the
 * new simple-icons dependency version is outputted.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PACKAGE_JSON_FILE = path.resolve(__dirname, '..', 'package.json');

function getManifest() {
  const packageFileRaw = fs.readFileSync(PACKAGE_JSON_FILE).toString();
  const packageFile = JSON.parse(packageFileRaw);
  return packageFile;
}

function main() {
  try {
    const manifestBefore = getManifest();
    const versionBefore = manifestBefore.dependencies['simple-icons'];

    execSync('npm uninstall simple-icons', { stdio: 'ignore' });
    execSync('npm install --save-exact simple-icons', { stdio: 'ignore' });

    const manifestAfter = getManifest();
    const versionAfter = manifestAfter.dependencies['simple-icons'];

    if (versionBefore === versionAfter) {
      throw new Error('Simple icons does not need to be updated');
    }

    console.log(versionAfter);
  } catch (error) {
    console.error('Failed to update simple-icons to latest version:', error);
    process.exit(1);
  }
}

main();
