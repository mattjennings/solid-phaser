import {
  createServer as createViteServer,
  ViteDevServer,
  mergeConfig,
} from 'vite'
import path from 'path'
import del from 'del'
import createManifestData from '../util/create-manifest-data'
import { createApp } from '../util/create-app'
import chokidar from 'chokidar'
import { yellow } from 'kleur'
import { getConfig } from '../config'

export default async function dev({ cwd = process.cwd(), port = 3000 } = {}) {
  const config = await getConfig()
  const dir = path.resolve(cwd, '.solid-phaser')
  await del(dir)
  await del('./dist') // vite will read dist/index.html for some reason

  const server = await createViteServer(
    mergeConfig(
      {
        root: cwd,
        server: {
          port,
        },
      },
      config.vite
    )
  )

  watcher({ cwd, dir, server })

  await server.listen()
}

async function watcher({
  cwd,
  dir,
  server,
}: {
  cwd: string
  dir: string
  server: ViteDevServer
}) {
  const config = await getConfig()
  async function update() {
    const manifestData = await createManifestData({ cwd, config })
    createApp({
      manifestData,
      dir,
    })
    console.log(manifestData)
  }
  const dirs = [
    config.files.scenes,
    config.files.assets,
    config.files.game,
    'solid-phaser.config.js',
  ].filter(Boolean)

  update()

  // chokidar
  //   .watch(dirs)
  //   .on("add", async (filePath) => {
  //     await update();
  //   })
  //   .on("change", async (filePath) => {
  //     if (filePath.includes("solid-phaser.config.js")) {
  //       console.warn(
  //         yellow("solid-phaser.config.js was changed. Restart is required")
  //       );
  //     } else {
  //       await update();
  //     }
  //   });
}
