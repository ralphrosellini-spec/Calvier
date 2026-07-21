const fs = require('fs');
const path = require('path');

// These are the exact mojibake byte sequences → what they should be
// Order matters: longer sequences first
const REPLACEMENTS = [
  // Em-dash variants
  ['â₹"', '—'],
  // Bullet / middle dot variants  
  ['â₹¢', '•'],
  // Opening double quote
  ['â₹œ', '"'],
  // Closing double quote (no terminator char – use code point)
  ['â₹', '"'],
  // Ellipsis / star
  ['âœ¦', '✦'],
  // copyright
  ['Â©', '©'],
  // middle dot
  ['Â·', '•'],
  // accented e
  ['Ã©', 'é'],
  // Euro
  ['â‚¬', '€'],
  // Rupee
  ['â‚¹', '₹'],
  // pound
  ['Â£', '£'],
  // yen
  ['Â¥', '¥'],
  // French ç
  ['Ã§', 'ç'],
];

function walkDir(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        files = files.concat(walkDir(fullPath));
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  });
  return files;
}

const allFiles = walkDir('.');
let fixedCount = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  REPLACEMENTS.forEach(([bad, good]) => {
    if (content.includes(bad)) {
      // Replace all occurrences
      while (content.includes(bad)) {
        content = content.replace(bad, good);
      }
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
    fixedCount++;
  }
});

console.log('\nTotal files fixed:', fixedCount);
