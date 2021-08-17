import { TileSprite, TileSpriteProps } from 'solid-phaser'

export default function ParallaxBackground(props: TileSpriteProps) {
  return (
    <TileSprite
      // width={camera.width * 3}
      // height={camera.height}
      width={400 * 3}
      height={225}
      origin={{ x: 0, y: 0 }}
      depth={-1}
      scrollFactor={{ x: 0.1, y: 0 }}
      {...(props as any)}
    />
  )
}
