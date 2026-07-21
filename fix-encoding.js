const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        files = files.concat(walkDir(fullPath));
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  });
  return files;
}

const allFiles = walkDir('.');

const replacements = [
  { bad: 'â₹”', good: '—' },
  { bad: 'Ã©', good: 'é' },
  { bad: 'â†’', good: '→' },
  { bad: 'Â©', good: '©' },
  { bad: 'â€¢', good: '•' },
  { bad: 'â₹¢', good: '—' },
  { bad: 'â‚¹', good: '₹' },
  { bad: 'â€"', good: '—' },
  { bad: 'â€”', good: '—' },
  { bad: 'Ac 2026', good: '© 2026' },
  { bad: 'HonorAc', good: 'Honoré' },
  { bad: 'EN A EUR', good: 'EN • INR' }
];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  replacements.forEach(r => {
    if (content.includes(r.bad)) {
      content = content.split(r.bad).join(r.good);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
});
