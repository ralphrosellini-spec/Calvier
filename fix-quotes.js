const fs = require('fs');
const path = require('path');

// After the em-dash fix, these patterns like '"—' remain (opening smart quote before a dash)
// We want to clean these up to just '—'
const REPLACEMENTS = [
  // Leftover smart-quote + em-dash combos
  ['\u201c\u2014', '\u2014'],   // "— → —
  ['\u201d\u2014', '\u2014'],   // "— → —
  // Standalone curly quotes that shouldn't be there (in JSX text nodes)
  // We'll handle specific known cases below
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

// Now do file-specific targeted fixes
function fixFile(filePath, fixes) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  fixes.forEach(([bad, good]) => {
    if (content.includes(bad)) {
      while (content.includes(bad)) {
        content = content.replace(bad, good);
      }
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed targeted:', filePath);
  }
}

// app/page.tsx specific fixes
fixFile('app/page.tsx', [
  ['alt="Calvier Rossel \u201c\u2014 Autumn 2026 campaign"', 'alt="Calvier Rossel \u2014 Autumn 2026 campaign"'],
  ['>Autumn \u201c\u2014 Winter', '>Autumn \u2014 Winter'],
  ['Firenze \u201c\u2014 Paris \u201c\u2014 Tokyo', 'Firenze \u2014 Paris \u2014 Tokyo'],
  ['Featured \u201c\u2014 Icons', 'Featured \u2014 Icons'],
  ['001\u201c\u2014100', '001\u2014100'],
  ['\u201c{q.q}\u201d', '\u201c{q.q}\u201d'],  // keep proper quote pair for testimonials
  ['figcaption>\u201c\u2014 {q.a}', 'figcaption>\u2014 {q.a}'],
  ['/* Hero \u201c\u2014 fashion', '/* Hero \u2014 fashion'],
]);

fixFile('app/about/page.tsx', [
  ['Maison Fond\u00e9e', 'Maison Fond\u00e9e'],
  ['era \u201c\u2014 garments', 'era \u2014 garments'],
  ['\u201c\u2014 Calvier Rossel', '\u2014 Calvier Rossel'],
]);

fixFile('app/layout.tsx', [
  ['ROSSEL \u201c\u2014 Luxury', 'ROSSEL \u2014 Luxury'],
]);

fixFile('components/layout/Footer.tsx', [
  ['Paris \u201c\u2014 Rue', 'Paris \u2014 Rue'],
  ['Milan \u201c\u2014 Via', 'Milan \u2014 Via'],
  ['Tokyo \u201c\u2014 Ginza', 'Tokyo \u2014 Ginza'],
]);

fixFile('app/checkout/page.tsx', [
  ['color} \u201c\u2014 {item', 'color} \u2022 {item'],
]);

fixFile('constants/index.ts', [
  ['5\u201c\u20147', '5\u20147'],
  ['2\u201c\u20143', '2\u20143'],
  ['SS 2026 \u201c\u2014 Aurora', 'SS 2026 \u2014 Aurora'],
  ['FW 2025 \u201c\u2014 Noir', 'FW 2025 \u2014 Noir'],
]);

fixFile('types/index.ts', [
  ['ROSSEL \u201c\u2014 Core', 'ROSSEL \u2014 Core'],
]);

console.log('\nAll targeted fixes applied.');
