import Phaser from "phaser";
import { JSX, onCleanup, splitProps } from "solid-js";
import { useScene } from "../Scene";
import { createApplyPropsEffect } from "../util/createApplyPropsEffect";
import { useGameObject } from "../game-objects/GameObject";

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
  children?: JSX.Element;
}

export default function ArcadePhysics(props: ArcadePhysicsProps) {
  const instance =
    useGameObject<Phaser.Types.Physics.Arcade.GameObjectWithBody>();
  const scene = useScene();

  const [local, other] = splitProps(props, ["static"]);

  scene.physics.world.enable(
    instance,
    local.static
      ? Phaser.Physics.Arcade.STATIC_BODY
      : Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  if (!local.static) {
    createApplyPropsEffect(instance.body as Phaser.Physics.Arcade.Body, other, {
      accelerationX: (body, val) => body.setAccelerationX(val),
      accelerationY: (body, val) => body.setAccelerationY(val),
      bounceX: (body, val) => body.setBounceX(val),
      bounceY: (body, val) => body.setBounceY(val),
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
      maxVelocityX: (body, val) => body.setMaxVelocityX(val),
      maxVelocityY: (body, val) => body.setMaxVelocityY(val),
    });
  }

  onCleanup(() => {
    if (scene.children.exists(instance)) {
      scene.physics.world.disable(instance);
    }
  });

  return props.children;
}

export interface AccelerationProps {
  accelerationX?: number;
  accelerationY?: number;
}

export interface AngularProps {
  angularAcceleration?: number;
  angularDrag?: number;
  angularVelocity?: number;
}

export interface BounceProps {
  bounceX?: number;
  bounceY?: number;
  collideWorldBounds?: boolean;
  onWorldBounds?: boolean;
}

export interface DebugProps {
  debugBodyColor?: number;
  debugShowBody?: boolean;
  debugShowVelocity?: boolean;
}

export interface DragProps {
  damping?: number;
  dragX?: number;
  dragY?: number;
  allowDrag?: boolean;
}

export interface EnableProps {
  disableBody?: boolean;
}

export interface FrictionProps {
  frictionX?: number;
  frictionY?: number;
}

export interface GravityProps {
  allowGravity?: boolean;
  gravityX?: number;
  gravityY?: number;
}

export interface ImmovableProps {
  immovable?: boolean;
}

export interface MassProps {
  mass?: number;
}

export interface SizeProps {
  circle?: {
    radius: number;
    offsetX?: number;
    offsetY?: number;
  };
  offset?: {
    x?: number;
    y?: number;
  };
  size?: {
    width: number;
    height: number;
    center?: boolean;
  };
}

export interface VelocityProps {
  velocityX?: number;
  velocityY?: number;
  maxVelocityX?: number;
  maxVelocityY?: number;
}
