const fs = require('fs');
const path = require('path');

// Fix CSS
const dir = path.join(__dirname, '..', 'dist', 'assets');
if (fs.existsSync(dir)) {
  fs.readdirSync(dir).filter(f => f.endsWith('.css')).forEach(f => {
    const p = path.join(dir, f);
    const css = fs.readFileSync(p, 'utf8');
    fs.writeFileSync(p, css.replace(
      'img.fade-in.visible{box-shadow:none}',
      'img.fade-in.visible{box-shadow:none;mix-blend-mode:lighten}'
    ));
  });
  console.log('CSS fix applied');
}

// Force copy ALL public assets to dist (Vite publicDir sometimes fails on Vercel)
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // Always copy (overwrite if exists to ensure latest version)
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(publicDir, distDir);

// Count copied files
let count = 0;
function countFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) countFiles(path.join(dir, entry.name));
    else if (entry.name.match(/\.(png|jpg|jpeg)$/i)) count++;
  }
}
countFiles(path.join(distDir, 'assets'));
console.log(`Public assets copied: ${count} images in dist/assets`);
