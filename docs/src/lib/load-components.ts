import * as fs from 'node:fs'
import { promisify } from 'node:util'
import { resolve } from 'node:path'

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

export async function loadComponents() {
  const files = await getFiles('../packages/solid-phaser/src')
  const components = files.filter((file) => file.endsWith('tsx'))

  return components.map((path) => ({
    path,
    name: path.split('/').pop().split('.tsx')[0],
  }))
}

async function getFiles(dir: string) {
  const subdirs = await readdir(dir)
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir)
      return (await stat(res)).isDirectory() ? getFiles(res) : res
    })
  )
  return files.reduce((a, f) => a.concat(f), [])
}
