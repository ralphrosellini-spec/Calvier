const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fp = path.join(dir, file);
    if (fs.statSync(fp).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) files = files.concat(walkDir(fp));
    } else if (fp.endsWith('.ts') || fp.endsWith('.tsx')) files.push(fp);
  });
  return files;
}

let issues = 0;
walkDir('.').forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    // Check for obvious mojibake byte sequences
    const hasMojibake = (
      line.includes('\u00e2\u201a\u00ac') ||  // â€  mojibake prefix
      line.includes('\u00c3\u00a9') ||  // Ã© 
      line.includes('\u00c2\u00a9') ||  // Â©
      line.includes('\u00c2\u00b7') ||  // Â·
      line.includes('\u00c2\u00a3') ||  // Â£
      line.includes('\u00c2\u00b0') ||  // Â°  (degree)
      line.includes('\u00c3\u00a2') ||  // Ã¢
      line.includes('\u00e2\u201c') ||  // â€ (check)
      line.includes('\u00e2\u2020\u2019')  // â†' arrow mojibake
    );
    // Check for leftover open-curly-quote + dash (not in comments or JSX strings that should have them)
    const hasBadQuote = (
      line.includes('\u201c\u2014') ||   // "— not expected
      line.includes('\u201c\u2022')      // "• not expected
    );
    if (hasMojibake || hasBadQuote) {
      console.log(file + ':' + (i + 1) + ': ' + line.trim().substring(0, 120));
      issues++;
    }
  });
});

if (issues === 0) console.log('ALL CLEAN! No issues found.');
else console.log('\nTotal issues found:', issues);
