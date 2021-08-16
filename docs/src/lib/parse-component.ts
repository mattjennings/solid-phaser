import { resolve } from 'node:path'
import { withCustomConfig } from 'react-docgen-typescript'
const parser = withCustomConfig(
  resolve(`../packages/solid-phaser/tsconfig.json`),
  {}
)

export const parseComponent = parser.parse
