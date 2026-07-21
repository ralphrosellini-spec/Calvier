const fs = require('fs');
const path = require('path');

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
let totalBad = 0;
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    // Check for common mojibake sequences
    const badPatterns = [
      'â€', 'Ã©', 'Â©', 'Â·', 'Â£', 'Â¥', 'â‚¬', 'â‚¹', 'ðŸ', 'Ø¯', 'Ã¢',
      'â₹', 'âœ', 'Ã§', 'Ã¹'
    ];
    const hasBad = badPatterns.some(p => line.includes(p));
    if (hasBad) {
      console.log(file + ':' + (i + 1) + ': ' + line.trim().substring(0, 120));
      totalBad++;
    }
  });
});
console.log('\nTotal bad lines:', totalBad);
