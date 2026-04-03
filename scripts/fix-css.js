const fs = require('fs');
const path = require('path');
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
