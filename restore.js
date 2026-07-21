const fs = require('fs');

function restoreFile(src, dest) {
  let content = fs.readFileSync(src, 'utf8');
  
  if (!dest.includes('constants/index.ts') && !dest.includes('constants\\\\index.ts')) {
    content = content.replace(/€/g, '&#8377;');
    content = content.replace(/toLocaleString\(\)/g, "toLocaleString('en-IN')");
  } else {
    // For constants, we want the raw ₹ symbol, not HTML entities, since it might be used directly in TS logic
    // Actually, constants/index.ts defines the currencies array. The default is EUR. Let's change the EUR entry to INR entry.
    // Wait, the user already asked for ₹ everywhere. The earlier change to utils.ts uses INR.
    // I will just copy the file over as is (uncorrupted) so all flags and emojis are back.
    // The only needed change in constants/index.ts is the default currency symbol if used anywhere, but utils.ts overrides it.
  }
  
  fs.writeFileSync(dest, content, 'utf8');
  console.log('Restored & Fixed:', dest);
}

const files = [
  'app/about/page.tsx',
  'app/checkout/page.tsx',
  'app/layout.tsx',
  'app/page.tsx',
  'components/layout/AnnouncementBar.tsx',
  'components/layout/CartDrawer.tsx',
  'components/layout/Footer.tsx',
  'components/layout/MobileMenu.tsx',
  'components/layout/Navbar.tsx',
  'constants/index.ts',
  'types/index.ts'
];

files.forEach(f => {
  restoreFile(
    'C:/Users/Hp/Desktop/calvier-temp/' + f,
    'C:/Users/Hp/Desktop/CALVIER ROSSEL/calvier-rossel/' + f
  );
});
