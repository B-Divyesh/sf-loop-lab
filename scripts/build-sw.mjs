import { createHash } from 'node:crypto'
import { copyFile, readFile, readdir, writeFile } from 'node:fs/promises'

const assets = (await readdir('dist/assets')).map(name => `/assets/${name}`)
const buildId = createHash('sha256').update(assets.join('|')).digest('hex').slice(0, 12)
const workerPath = 'dist/sw.js'
const worker = (await readFile(workerPath, 'utf8'))
  .replace('__BUILD_ID__', buildId)
  .replace("'__BUILD_ASSETS__'", assets.map(asset => `'${asset}'`).join(', '))

await writeFile(workerPath, worker)
await copyFile('dist/index.html', 'dist/404.html')
