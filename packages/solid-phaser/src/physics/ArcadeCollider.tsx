import Phaser from 'phaser'
import { onCleanup, onMount, splitProps } from 'solid-js'
import { onSceneEvent } from '../events'
import { useGameObject } from '../game-objects/GameObject'
import { useScene } from '../Scene'
import { createApplyPropsEffect } from '../util/createApplyPropsEffect'
import { getGameObjectsByName } from '../util/getGameObjectsByName'
import { toArray } from '../util/toArray'

export interface ArcadeColliderProps<
  Self extends Phaser.Types.Physics.Arcade.GameObjectWithBody,
  Other extends Phaser.Types.Physics.Arcade.GameObjectWithBody
> {
  with?:
    | string
    | string[]
    | Phaser.GameObjects.GameObject
    | Phaser.GameObjects.GameObject[]
    | Phaser.GameObjects.Group
    | Phaser.GameObjects.Group[]
  overlap?: boolean
  allowCollision?: (self: Self, other: Other) => boolean

  onCollide?: (self: Self, other: Other) => any
  worldBounds?: boolean
  onWorldBounds?: (
    self: Self,
    blocked: { up: boolean; down: boolean; left: boolean; right: boolean }
  ) => any
}

export function ArcadeCollider<
  Self extends Phaser.Types.Physics.Arcade.GameObjectWithBody,
  Other extends Phaser.Types.Physics.Arcade.GameObjectWithBody
>(props: ArcadeColliderProps<Self, Other>) {
  const instance =
    useGameObject<Phaser.Types.Physics.Arcade.GameObjectWithBody>()
  const scene = useScene()

  if (!instance.body) {
    throw Error(
      '<ArcadeCollider /> requires the parent GameObject to have a physics body. You can add one with <ArcadePhysics />.'
    )
  }

  const self = [instance]
  const other = createObjectsArray(scene, props.with)
  const collider: Phaser.Physics.Arcade.Collider = props.overlap
    ? scene.physics.add.overlap(
        self,
        other,
        props.onCollide,
        props.allowCollision
      )
    : scene.physics.add.collider(
        self,
        other,
        props.onCollide,
        props.allowCollision
      )

  onCleanup(() => {
    collider?.destroy()
  })

  const [colliderProps] = splitProps(props, [
    'with',
    'overlap',
    'allowCollision',
    'onCollide',
    'worldBounds',
  ])

  // wait until onMount to update the collider
  onMount(() => {
    createApplyPropsEffect(collider, colliderProps, {
      with: (collider, val) => {
        collider.object2 = createObjectsArray(scene, val)
      },
      overlap: (collider, val) => {
        collider.overlapOnly = val
      },
      allowCollision: (collider, val) => {
        collider.processCallback = val
      },
      onCollide: (collider, val) => {
        collider.collideCallback = val
      },
      worldBounds: (collider, val) => {
        const body = instance.body as Phaser.Physics.Arcade.Body

        body.onWorldBounds = val
        body.setCollideWorldBounds(val)
      },
    })
  })

  // onWorldBounds
  onMount(() => {
    if (props.onWorldBounds) {
      const cb = (body, up, down, left, right) => {
        if (body === instance.body) {
          props.onWorldBounds(instance as any, { up, down, left, right })
        }
      }
      scene.physics.world.on('worldbounds', cb)

      onCleanup(() => {
        scene.physics.world.off('worldbounds', cb)
      })
    }
  })

  // if props.with contains any names, the references when a child is added to the scene
  onSceneEvent(
    Phaser.Scenes.Events.ADDED_TO_SCENE,
    async (object: Phaser.GameObjects.GameObject) => {
      if (collider && object.name) {
        const withStrings = toArray(props.with).filter(
          (obj) => typeof obj === 'string'
        )

        if (withStrings.includes(object.name)) {
          // @ts-ignore
          collider.object2 = [...collider.object2, object]
        }
      }
    }
  )

  return null
}

function createObjectsArray(scene, objects) {
  return toArray(objects).reduce((total, object) => {
    if (typeof object === 'string') {
      return [...total, ...getGameObjectsByName(scene, object)]
    }

    return [...total, object]
  }, [])
}
