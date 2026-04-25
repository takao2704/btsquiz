import { copyFileSync, existsSync } from 'node:fs';

const indexPath = 'dist/index.html';
const notFoundPath = 'dist/404.html';

if (!existsSync(indexPath)) {
  console.error('dist/index.html not found. Run build first.');
  process.exit(1);
}

copyFileSync(indexPath, notFoundPath);
console.log('Created dist/404.html for GitHub Pages SPA fallback.');
