const fs = require('fs');
const path = require('path');
const dir = 'c:/Development/agrivision/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

let mc = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf-8');
  let original = c;
  
  // MATCH exactly: bg-*, hover:bg-*, dark:bg-*, dark:hover:bg-* with /opacity
  // E.g. dark:hover:bg-slate-800/50 -> dark:hover:bg-slate-800
  c = c.replace(/(?:dark:)?(?:hover:)?bg-([a-z]+)-(\d+)\/\d+/g, (match) => {
    return match.split('/')[0]; 
  });
  
  // Also strip opacity from dark:bg-white/90 or similar if they exist? none should exist.
  // Actually, wait, `dark:bg-slate-800/90` is matched above.
  
  if (c !== original) {
    fs.writeFileSync(f, c);
    console.log(`Updated ${path.basename(f)}`);
    mc++;
  }
});
console.log(`Replacements completed in ${mc} files.`);
