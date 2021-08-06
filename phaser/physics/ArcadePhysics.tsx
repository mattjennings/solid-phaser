import { onMount, splitProps } from "solid-js";
import { useScene } from "solid-phaser/Scene";
import { createApplyPropsEffect } from "solid-phaser/util/createApplyPropsEffect";
import {
  AccelerationProps,
  AngularProps,
  BounceProps,
  DebugProps,
  DragProps,
  EnableProps,
  FrictionProps,
  GravityProps,
  ImmovableProps,
  MassProps,
  SizeProps,
  useGameObject,
  VelocityProps,
} from "../GameObject";

export interface ArcadePhysicsProps
  extends AccelerationProps,
    AngularProps,
    BounceProps,
    DebugProps,
    EnableProps,
    DragProps,
    FrictionProps,
    GravityProps,
    ImmovableProps,
    MassProps,
    SizeProps,
    VelocityProps {
  static?: boolean;
}

export default function ArcadePhysics(props: ArcadePhysicsProps) {
  const instance = useGameObject<
    Phaser.GameObjects.GameObject & { body: Phaser.Physics.Arcade.Body }
  >();
  const scene = useScene();

  const [local, other] = splitProps(props, ["static"]);

  scene.physics.world.enable(
    instance,
    local.static
      ? Phaser.Physics.Arcade.STATIC_BODY
      : Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  createApplyPropsEffect(instance.body, other, {
    accelerationX: (body, val) => body.setAccelerationX(val),
    accelerationY: (body, val) => body.setAccelerationY(val),
    bounceX: (body, val) => body.setAccelerationX(val),
    bounceY: (body, val) => body.setAccelerationY(val),
    dragX: (body, val) => body.setDragX(val),
    dragY: (body, val) => body.setDragY(val),
    frictionX: (body, val) => body.setFrictionX(val),
    frictionY: (body, val) => body.setFrictionY(val),
    gravityX: (body, val) => body.setGravityX(val),
    gravityY: (body, val) => body.setGravityY(val),
    circle: (body, { radius, offsetX, offsetY }) =>
      body.setCircle(radius, offsetX, offsetY),
    size: (body, { width, height, center }) =>
      body.setSize(width, height, center),
    offset: (body, { x, y }) => body.setOffset(x, y),
    velocityX: (body, val) => body.setVelocityX(val),
    velocityY: (body, val) => body.setVelocityY(val),
  });

  onMount(() => {
    return () => {
      if (scene.children.exists(instance)) {
        scene.physics.world.disable(instance);
      }
    };
  });

  return null;
}
