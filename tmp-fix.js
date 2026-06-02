const fs = require('fs');
const path = require('path');

const dir = 'c:/Development/agrivision/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

let matchedCount = 0;

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf-8');
  let original = c;
  
  // Replace dark:bg-slate-800/50 with dark:bg-slate-800
  // Applies to any `prefix-color-number/opacity`
  c = c.replace(/([a-z]+)-([a-z]+)-(\d+)\/\d+/g, '$1-$2-$3');
  
  // Fix bg-white/90 -> bg-white bg-opacity-90
  c = c.replace(/bg-white\/(90|95)/g, 'bg-white bg-opacity-$1');

  if (c !== original) {
    fs.writeFileSync(f, c);
    console.log(`Updated ${path.basename(f)}`);
    matchedCount++;
  }
});

console.log(`Replacements completed in ${matchedCount} files.`);
