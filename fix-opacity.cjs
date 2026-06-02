const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace backdrop bg-slate-900/XX with bg-black/XX
  content = content.replace(/bg-slate-900\/([0-9]{2})/g, (match, opacity) => {
    // Check if it's likely a backdrop (contains fixed inset-0 or backdrop-blur)
    // Actually, let's just replace all bg-slate-900/XX with bg-black/XX if it's a backdrop,
    // but the regex might be tricky. Let's just replace all dark:bg-slate-XXX/YY with dark:bg-slate-XXX
    return `bg-black/${opacity}`;
  });

  // Wait, if it's dark:bg-slate-900/50, we want dark:bg-slate-900.
  // So let's do dark:bg-slate-XXX/YY -> dark:bg-slate-XXX first.
  
  // Reset content to original to do it properly
  content = originalContent;

  // 1. Replace dark:bg-slate-XXX/YY with dark:bg-slate-XXX
  content = content.replace(/dark:bg-slate-([0-9]{2,3})\/[0-9]{2}/g, 'dark:bg-slate-$1');
  
  // 2. Replace dark:hover:bg-slate-XXX/YY with dark:hover:bg-slate-XXX
  content = content.replace(/dark:hover:bg-slate-([0-9]{2,3})\/[0-9]{2}/g, 'dark:hover:bg-slate-$1');

  // 3. Replace dark:border-slate-XXX/YY with dark:border-slate-XXX
  content = content.replace(/dark:border-slate-([0-9]{2,3})\/[0-9]{2}/g, 'dark:border-slate-$1');

  // 4. Replace bg-slate-900/XX with bg-black/XX (these are usually light/dark agnostic backdrops)
  content = content.replace(/(?<!dark:)bg-slate-900\/([0-9]{2})/g, 'bg-black/$1');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(componentsDir);
console.log('Done');
