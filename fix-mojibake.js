const fs = require('fs');
const path = require('path');

const replacements = [
  { bad: 'Autumn - Winter Ã‚Â· MMXXVI', good: 'Autumn - Winter • MMXXVI' },
  { bad: 'Autumn - Winter Â· MMXXVI', good: 'Autumn - Winter • MMXXVI' },
  { bad: 'Autumn - Winter A MMXXVI', good: 'Autumn - Winter • MMXXVI' },
  { bad: 'NÃ‚Â°', good: 'N°' },
  { bad: 'NÂ°', good: 'N°' },
  { bad: 'NA', good: 'N°' },
  { bad: '001Ã¢â‚¬â€ 100', good: '001—100' },
  { bad: '001â€”100', good: '001—100' },
  { bad: '001?\"100', good: '001—100' },
  { bad: 'Bags Ã‚Â·', good: 'Bags •' },
  { bad: 'Bags Â·', good: 'Bags •' },
  { bad: 'Bags A', good: 'Bags •' },
  { bad: 'Shoes Ã‚Â·', good: 'Shoes •' },
  { bad: 'Shoes Â·', good: 'Shoes •' },
  { bad: 'Shoes A', good: 'Shoes •' },
  { bad: 'Ã¢â‚¬Å“', good: '\"' },
  { bad: 'â€œ', good: '\"' },
  { bad: 'Ã¢â‚¬Â', good: '\"' },
  { bad: 'â€', good: '\"' },
  { bad: '?o{', good: '\"{ ' },
  { bad: '}??', good: ' }\"' },
  { bad: 'Ã¢â‚¬â€', good: '—' },
  { bad: 'â€”', good: '—' },
  { bad: 'Ã‚Â·', good: '•' },
  { bad: 'Â·', good: '•' },
  { bad: 'Ã¢Å“Â¦', good: '✦' },
  { bad: 'âœ¦', good: '✦' },
  { bad: 'A', good: '•' },
  { bad: 'o', good: '✦' },
  { bad: 'HonorÃƒÂ©', good: 'Honoré' },
  { bad: 'HonorÃ©', good: 'Honoré' },
  { bad: 'Ã‚Â©', good: '©' },
  { bad: 'Â©', good: '©' },
  { bad: 'â‚¬', good: '€' },
  { bad: 'Â£', good: '£' },
  { bad: 'Â¥', good: '¥' },
  { bad: 'Ø¯.Ø¥', good: 'د.إ' },
  { bad: 'ðŸ‡ºðŸ‡¸', good: '🇺🇸' },
  { bad: 'FranÃ§ais', good: 'Français' },
  { bad: 'ðŸ‡«ðŸ‡·', good: '🇫🇷' },
  { bad: 'ðŸ‡©ðŸ‡ª', good: '🇩🇪' },
  { bad: 'ðŸ‡®ðŸ‡¹', good: '🇮🇹' },
  { bad: 'ðŸ‡¯ðŸ‡µ', good: '🇯🇵' },
  { bad: 'ðŸ‡¦ðŸ‡ª', good: '🇦🇪' },
  { bad: 'Ã©', good: 'é' },
  { bad: 'â₹¢', good: '—' },
  { bad: 'â‚¹', good: '₹' },
  { bad: 'â€\"', good: '—' },
  { bad: 'â€\"', good: '—' },
  { bad: 'â₹”', good: '—' },
  { bad: 'â†’', good: '→' }
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

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  replacements.forEach(r => {
    while (content.includes(r.bad)) {
      content = content.replace(r.bad, r.good);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
});
