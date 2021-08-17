import { Tilemap } from 'solid-phaser'

export default () => {
  return (
    <Tilemap
      key="tilemaps/bay-area/tilemap"
      useLayerOrder
      tilesets={{
        tileset: 'tilemaps/bay-area/tileset',
      }}
    >
      {/* <Spawner
        on:destroy={(event) => {
          if (event.detail.reason === 'player-dead') {
            restart()
          }
        }}
      > */}
      <Tilemap.TileLayer id="background" />
      <Tilemap.TileLayer id="foreground" />
      <Tilemap.TileLayer
        id="ground"
        name="ground"
        collisionByProperty={{ collision: true }}
      />
      {/* <TilemapObjectLayer id="spawns" components={{ Player, EnemySpawner }} /> */}
      {/* </Spawner> */}
    </Tilemap>
  )
}
