#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function findLocalesRoot() {
  const candidates = [path.join(process.cwd(), 'src', 'locales'), path.join(process.cwd(), 'public', 'locales')];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

function isLocaleCode(name) {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(name);
}

function detectPattern(root) {
  const items = fs.readdirSync(root);
  const dirs = items.filter(i => fs.statSync(path.join(root, i)).isDirectory());
  if (dirs.length === 0) {
    // files directly inside -> try to infer from filenames like en.json or common.json
    const files = items.filter(i => i.endsWith('.json'));
    if (files.length === 0) return null;
    // if filenames look like en.json -> namespace/{locale} unlikely; default to {namespace}/{locale}
    return '{namespace}/{locale}.json';
  }

  // If subfolders look like locale codes -> {locale}/{namespace}
  const localeLike = dirs.filter(isLocaleCode).length;
  if (localeLike / dirs.length >= 0.6) return '{locale}/{namespace}.json';

  // otherwise assume {namespace}/{locale}.json (folders are namespaces)
  return '{namespace}/{locale}.json';
}

function updateSettings(pathMatcher) {
  const settingsPath = path.join(process.cwd(), '.vscode', 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    console.error('No .vscode/settings.json found. Please create one first.');
    process.exit(2);
  }
  const raw = fs.readFileSync(settingsPath, 'utf8');
  const cfg = JSON.parse(raw);
  cfg['i18n-ally.pathMatcher'] = pathMatcher;
  fs.writeFileSync(settingsPath, JSON.stringify(cfg, null, 4) + '\n', 'utf8');
  console.log('Updated .vscode/settings.json -> i18n-ally.pathMatcher =', pathMatcher);
}

function main() {
  const root = findLocalesRoot();
  if (!root) {
    console.error('No locales root found (checked src/locales and public/locales).');
    process.exit(1);
  }
  const pattern = detectPattern(root);
  if (!pattern) {
    console.error('Could not detect pattern.');
    process.exit(3);
  }
  updateSettings(pattern);
}

main();
