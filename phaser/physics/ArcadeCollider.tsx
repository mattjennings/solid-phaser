import { createEffect, onMount, splitProps } from "solid-js";
import { onSceneEvent } from "solid-phaser/events";
import { useScene } from "solid-phaser/Scene";
import { createApplyPropsEffect } from "solid-phaser/util/createApplyPropsEffect";
import { getGameObjectsByName } from "solid-phaser/util/getGameObjectsByName";
import { toArray } from "solid-phaser/util/toArray";
import { useGameObject } from "../GameObject";

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
    | Phaser.GameObjects.Group[];
  overlap?: boolean;
  worldBounds?: boolean;
  allowCollision?: (self: Self, other: Other) => boolean;

  onCollide?: (self: Self, other: Other) => any;
  onWorldBounds?: (
    self: Self,
    blocked: { up: boolean; down: boolean; left: boolean; right: boolean }
  ) => any;
}

export default function ArcadeCollider<
  Self extends Phaser.Types.Physics.Arcade.GameObjectWithBody,
  Other extends Phaser.Types.Physics.Arcade.GameObjectWithBody
>(props: ArcadeColliderProps<Self, Other>) {
  const instance =
    useGameObject<Phaser.Types.Physics.Arcade.GameObjectWithBody>();
  const scene = useScene();

  if (!instance.body) {
    throw Error(
      "<ArcadeCollider /> requires the parent GameObject to have a physics body. You can add one with <ArcadePhysics />."
    );
  }

  const self = [instance];
  const other = createObjectsArray(scene, props.with);
  let collider: Phaser.Physics.Arcade.Collider = props.overlap
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
      );

  onMount(() => {
    return () => collider?.destroy();
  });

  const [colliderProps] = splitProps(props, [
    "with",
    "overlap",
    "allowCollision",
    "onCollide",
    "worldBounds",
  ]);

  createApplyPropsEffect(collider, colliderProps, {
    with: (collider, val) => {
      collider.object2 = createObjectsArray(scene, val);
    },
    overlap: (collider, val) => {
      collider.overlapOnly = val;
    },
    allowCollision: (collider, val) => {
      collider.processCallback = val;
    },
    onCollide: (collider, val) => {
      collider.collideCallback = val;
    },
    worldBounds: (collider, val) => {
      (instance.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(val);
    },
  });

  // onWorldBounds
  createEffect(() => {
    // @ts-ignore - so the worldbounds event gets emitted
    instance.body.onWorldBounds = !!props.onWorldBounds;
    if (props.onWorldBounds) {
      const cb = (body, up, down, left, right) => {
        if (body === instance.body) {
          props.onWorldBounds(instance as any, { up, down, left, right });
        }
      };
      scene.physics.world.on("worldbounds", cb);

      return () => {
        scene.physics.world.off("worldbounds", cb);
      };
    }
  });

  // if props.with contains any names, the references when a child is added to the scene
  onSceneEvent(
    Phaser.Scenes.Events.ADDED_TO_SCENE,
    async (object: Phaser.GameObjects.GameObject) => {
      if (collider && object.name) {
        const withStrings = toArray(props.with).filter(
          (obj) => typeof obj === "string"
        );

        if (withStrings.includes(object.name)) {
          // @ts-ignore
          collider.object2 = [...collider.object2, object];
        }
      }
    }
  );

  return null;
}

function createObjectsArray(scene, objects) {
  return toArray(objects).reduce((total, object) => {
    if (typeof object === "string") {
      return [...total, ...getGameObjectsByName(scene, object)];
    }

    return [...total, object];
  }, []);
}
