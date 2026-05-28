#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'src', 'locales');
if (!fs.existsSync(root)) {
  console.error('No src/locales directory found.');
  process.exit(1);
}

const targetsArg = process.argv[2] || 'en';
const targets = targetsArg.split(',').map(s => s.trim()).filter(Boolean);
const sourceLang = process.env.SOURCE_LANG || 'fr';

let created = 0;

const namespaces = fs.readdirSync(root).filter(d => fs.statSync(path.join(root, d)).isDirectory());
for (const ns of namespaces) {
  const nsPath = path.join(root, ns);
  const sourceFile = path.join(nsPath, `${sourceLang}.json`);
  if (!fs.existsSync(sourceFile)) continue;
  const data = fs.readFileSync(sourceFile, 'utf8');
  for (const tgt of targets) {
    const tgtFile = path.join(nsPath, `${tgt}.json`);
    if (fs.existsSync(tgtFile)) continue; // don't overwrite
    fs.writeFileSync(tgtFile, data, 'utf8');
    console.log(`Created ${path.relative(process.cwd(), tgtFile)}`);
    created++;
  }
}

console.log(`Done. ${created} files created (source: ${sourceLang}, targets: ${targets.join(',')}).`);
