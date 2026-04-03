const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

// Step 1: Force copy ALL public assets to dist using cpSync
try {
  fs.cpSync(publicDir, distDir, { recursive: true, force: true });
  console.log('Public assets force-copied to dist via cpSync');
} catch (e) {
  // Fallback for older Node versions
  console.log('cpSync failed, using manual copy:', e.message);
  function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  copyDir(publicDir, distDir);
  console.log('Manual copy complete');
}

// Step 2: Fix CSS
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  fs.readdirSync(assetsDir).filter(f => f.endsWith('.css')).forEach(f => {
    const p = path.join(assetsDir, f);
    const css = fs.readFileSync(p, 'utf8');
    fs.writeFileSync(p, css.replace(
      'img.fade-in.visible{box-shadow:none}',
      'img.fade-in.visible{box-shadow:none;mix-blend-mode:lighten}'
    ));
  });
  console.log('CSS fix applied');
}

// Step 3: Verify image count
let count = 0;
function countFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) countFiles(path.join(dir, entry.name));
    else if (entry.name.match(/\.(png|jpg|jpeg)$/i)) count++;
  }
}
countFiles(assetsDir);
console.log(`Verified: ${count} images in dist/assets`);
