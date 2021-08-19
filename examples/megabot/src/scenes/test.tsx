import { createEffect, createSignal, onCleanup, Show } from 'solid-js'
import { Tilemap, Spawner, FPS } from 'solid-phaser'
import ParallaxBackground from '../components/ParallaxBackground'
import Player from '../components/Player'
import tilemap from '../assets/tilemaps/bay-area/tilemap.json'

export default () => {
  const [show, setShow] = createSignal(true)
  // const i = setInterval(() => setShow(!show()), 1000)
  // onCleanup(() => clearInterval(i))

  return (
    <>
      <FPS x={0} y={0} style={{ color: 'white' }} />

      <Show when={show()}>
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
          <Spawner
          // on:destroy={(event) => {
          //   if (event.detail.reason === 'player-dead') {
          //     restart()
          //   }
          // }}
          >
            {/* <Player depth={0} x={100} y={200} /> */}
            <Tilemap.ObjectLayer
              id="spawns"
              components={{ Player, EnemySpawner: () => null }}
            />
          </Spawner>
        </Tilemap>
      </Show>
    </>
  )
}
