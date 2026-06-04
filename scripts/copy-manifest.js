import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

mkdirSync(resolve(root, 'dist/icons'), { recursive: true });
copyFileSync(resolve(root, 'manifest.json'), resolve(root, 'dist/manifest.json'));

const icons = ['icon16.png', 'icon48.png', 'icon128.png'];
for (const icon of icons) {
  const src = resolve(root, `public/icons/${icon}`);
  const dest = resolve(root, `dist/icons/${icon}`);
  if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`✅ Copied: ${icon}`);
  } else {
    console.warn(`⚠️  Not found: public/icons/${icon}`);
  }
}

console.log('✅ manifest.json copied to dist/');