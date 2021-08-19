import { createEffect, createSignal, onCleanup, Show } from 'solid-js'
import { Tilemap, Spawner, FPS, Camera, Tween, useCamera } from 'solid-phaser'
import ParallaxBackground from '../components/ParallaxBackground'
import Player from '../components/Player'
import tilemap from '../assets/tilemaps/bay-area/tilemap.json'
import { useRouter } from 'solid-phaser/router'
import Enemy from '../components/Enemy'
import EnemySpawner from '../components/EnemySpawner'

export default () => {
  const { restart } = useRouter()
  const camera = useCamera()
  camera.fadeIn(500)

  return (
    <>
      <Camera
        name="main"
        follow="player"
        followOffset={{ y: 0.5 }}
        x={0}
        y={0}
        width={400}
        height={225}
      >
        <Tilemap
          key="tilemaps/bay-area/tilemap"
          useLayerOrder
          tilesets={{
            tileset: 'tilemaps/bay-area/tileset',
          }}
        >
          <ParallaxBackground texture="tilemaps/bay-area/background" />
          <Tilemap.TileLayer id="background" />
          <Tilemap.TileLayer id="foreground" />
          <Tilemap.TileLayer
            id="ground"
            name="ground"
            collisionByProperty={{ collision: true }}
          />
          <Tilemap.ObjectLayer
            id="spawns"
            components={{ Player, EnemySpawner: () => null }}
            onDestroy={({ component }) => {
              if (component === Player) {
                setTimeout(() => camera.fadeOut(500), 1500)
                camera.on('camerafadeoutcomplete', restart)
              }
            }}
          />
        </Tilemap>
      </Camera>
    </>
  )
}
