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

// Ensure public assets are copied to dist (Vite should do this, but Vercel sometimes misses them)
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
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log('Copied missing:', entry.name);
      }
    }
  }
}

copyDir(publicDir, distDir);
console.log('Public assets verified');
