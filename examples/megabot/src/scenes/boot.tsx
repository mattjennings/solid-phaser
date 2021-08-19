import { SceneConfig, useRouter } from 'solid-phaser/router'

export const config: SceneConfig = {
  assets: {
    aseprite: [
      {
        key: 'sprites/player',
        atlasURL: 'sprites/player.json',
      },
      {
        key: 'sprites/enemy',
        atlasURL: 'sprites/enemy.json',
      },
      {
        key: 'sprites/explosion',
        atlasURL: 'sprites/explosion.json',
      },
    ],
    tilemapTiledJSON: ['tilemaps/bay-area/tilemap.json'],
    image: [
      {
        key: 'tilemaps/bay-area/tileset',
        url: 'tilemaps/bay-area/tileset-extruded.png',
      },
      'tilemaps/bay-area/background.png',
    ],
    audio: [
      'music/bay.mp3',
      'music/megabot.mp3',
      'sfx/shoot.mp3',
      'sfx/explosion.mp3',
      'sfx/player-die.mp3',
    ],
  },

  create: (scene) => {
    scene.anims.createFromAseprite('sprites/player')
    scene.anims.createFromAseprite('sprites/enemy')
    scene.anims.createFromAseprite('sprites/explosion')
  },
}

export default function Boot() {
  const { goto } = useRouter()

  // goto('titlescreen')
  goto('level1')

  return null
}
