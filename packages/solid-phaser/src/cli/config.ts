import { UserConfig as ViteConfig, mergeConfig } from 'vite'
import path from 'path'
import deepmerge from 'deepmerge'
import solid from 'vite-plugin-solid'

export interface SolidPhaserConfig {
  initialScene?: string
  files: {
    assets: string
    scenes: string
    game: string
    components: string
  }

  vite?: ViteConfig
}

export async function getConfig({
  production,
}: {
  production?: boolean
} = {}): Promise<SolidPhaserConfig> {
  const solidPhaserConfig = await getSolidPhaserConfig()
  return deepmerge<SolidPhaserConfig>(solidPhaserConfig, {
    vite: mergeConfig(
      {
        base: '', // keep paths to assets relative
        publicDir: solidPhaserConfig.files.assets,
        plugins: [solid()],
        optimizeDeps: {
          include: ['phaser'],
        },
        build: {
          sourcemap: true,
          minify: true,
          assetsDir: '',
          brotliSize: false,
          outDir: 'dist',
          // skip warnings about large chunks. games are going to be large.
          // (but maybe there is a reasonable limit still?)
          chunkSizeWarningLimit: 99999999,
        },
        resolve: {
          dedupe: ['solid-js', 'solid-phaser', 'solid-phaser/router'],
          alias: {
            phaser: production ? 'phaser/dist/phaser.min.js' : 'phaser',
            ...Object.keys(solidPhaserConfig.files).reduce(
              (acc, key) => ({
                ...acc,
                [`$${key}`]: path.resolve(solidPhaserConfig.files[key]),
              }),
              {}
            ),
          },
        },
        define: production
          ? {}
          : {
              // fix global.Phaser assignment in phaser/src/phaser.js
              global: {},
            },
      },
      solidPhaserConfig.vite ?? {}
    ),
  })
}

async function getSolidPhaserConfig(): Promise<SolidPhaserConfig> {
  const defaultConfig: SolidPhaserConfig = {
    files: {
      assets: 'src/assets',
      game: 'src/_game',
      scenes: 'src/scenes',
      components: 'src/components',
    },
  }

  try {
    const configPath = path.join(process.cwd(), `solid-phaser.config.js`)
    const config = await import(configPath)
    return deepmerge(defaultConfig, config.default)
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return defaultConfig
}
