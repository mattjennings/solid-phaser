const build = require('./build')
const path = require('path')
const { red } = require('kleur')
const { Worker } = require('worker_threads')
const dev = process.env.NODE_ENV !== 'production'

build({
  name: 'main',
  entry: path.resolve(__dirname, '../../src/index.ts'),
  outdir: path.join(__dirname, '../../dist'),
})

build({
  name: 'cli',
  platform: 'node',
  format: 'cjs',
  entry: path.resolve(__dirname, '../../src/cli/index.ts'),
  outdir: path.join(__dirname, '../../dist/cli'),
})

build({
  name: 'test',
  entry: path.resolve(__dirname, '../../src/test/index.ts'),
  outdir: path.join(__dirname, '../../dist/test'),
})

build({
  name: 'router',
  entry: path.resolve(__dirname, '../../src/router/index.ts'),
  outdir: path.join(__dirname, '../../dist/router'),
})

// generate types
const worker = new Worker('./scripts/build/types-worker.js', {
  workerData: {
    dev,
  },
})

worker.postMessage('build')
worker.on('error', (error) => {
  console.error(red(error.stack))

  if (!dev) {
    process.exit(1)
  }
})
