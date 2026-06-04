import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distPath = resolve(root, 'dist');
const releasePath = resolve(root, 'releases');

if (!existsSync(distPath)) {
  console.error('❌ dist/ klasörü bulunamadı. Önce npm run build çalıştırın.');
  process.exit(1);
}

if (!existsSync(releasePath)) {
  mkdirSync(releasePath, { recursive: true });
}

const pkg = JSON.parse(
  (await import('fs')).readFileSync(resolve(root, 'package.json'), 'utf-8')
);
const version = pkg.version;
const zipName = `jira-planner-ext-v${version}.zip`;
const zipPath = resolve(releasePath, zipName);

try {
  execSync(`powershell Compress-Archive -Path "${distPath}\\*" -DestinationPath "${zipPath}" -Force`);
  console.log(`✅ Zip oluşturuldu: releases/${zipName}`);
} catch {
  console.error('❌ Zip oluşturulamadı.');
  process.exit(1);
}