const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  replacements.forEach(r => {
    if (content.includes(r.bad)) {
      content = content.split(r.bad).join(r.good);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
  }
}

replaceInFile('app/page.tsx', [
  { bad: 'Autumn - Winter A', good: 'Autumn - Winter —' },
  { bad: 'text-cream/80">NA', good: 'text-cream/80">N°' },
  { bad: '001?"100', good: '001—100' },
  { bad: 'Bags A', good: 'Bags —' },
  { bad: 'Shoes A', good: 'Shoes —' },
  { bad: '?o{', good: '"{' },
  { bad: '}??<', good: '}"<' }
]);

replaceInFile('components/layout/AnnouncementBar.tsx', [
  { bad: 'A', good: '—' },
  { bad: 'o', good: '•' }
]);

replaceInFile('components/layout/Footer.tsx', [
  { bad: 'EN A EUR', good: 'EN • INR' }
]);

replaceInFile('constants/index.ts', [
  { bad: 'symbol: \',\'', good: 'symbol: \'€\'' },
  { bad: 'symbol: \'A\', name: \'British Pound\'', good: 'symbol: \'£\', name: \'British Pound\'' },
  { bad: 'symbol: \'A\', name: \'Japanese Yen\'', good: 'symbol: \'¥\', name: \'Japanese Yen\'' },
  { bad: '5?"7', good: '5-7' },
  { bad: '2?"3', good: '2-3' }
]);
