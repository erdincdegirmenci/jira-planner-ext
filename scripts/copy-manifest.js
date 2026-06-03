import { copyFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

mkdirSync(resolve(root, 'dist/icons'), { recursive: true })
copyFileSync(resolve(root, 'manifest.json'), resolve(root, 'dist/manifest.json'))

const icons = ['icon16.png', 'icon48.png', 'icon128.png']
for (const icon of icons) {
  try {
    copyFileSync(resolve(root, `public/icons/${icon}`), resolve(root, `dist/icons/${icon}`))
  } catch {
    console.warn(`Warning: ${icon} not found, skipping.`)
  }
}

console.log('manifest.json copied to dist/')