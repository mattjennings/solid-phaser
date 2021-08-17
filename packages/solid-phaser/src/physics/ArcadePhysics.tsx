import Phaser from 'phaser'
import { JSX, onCleanup, splitProps } from 'solid-js'
import { useScene } from '../Scene'
import { createApplyPropsEffect } from '../util/createApplyPropsEffect'
import { useGameObject } from '../game-objects/GameObject'
import { XY } from '../game-objects/props'

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
  static?: boolean
  children?: JSX.Element
}

export default function ArcadePhysics(props: ArcadePhysicsProps) {
  const instance =
    useGameObject<Phaser.Types.Physics.Arcade.GameObjectWithBody>()
  const scene = useScene()

  const [local, other] = splitProps(props, ['static'])

  scene.physics.world.enable(
    instance,
    local.static
      ? Phaser.Physics.Arcade.STATIC_BODY
      : Phaser.Physics.Arcade.DYNAMIC_BODY
  )

  if (!local.static) {
    createApplyPropsEffect(instance.body as Phaser.Physics.Arcade.Body, other, {
      acceleration: (body, val) =>
        body.setAcceleration(
          val.x ?? body.acceleration.x,
          val.y ?? body.acceleration.y
        ),
      bounce: (body, val) =>
        body.setBounce(val.x ?? body.bounce.x, val.y ?? body.bounce.y),
      drag: (body, val) =>
        body.setDrag(val.x ?? body.drag.x, val.y ?? body.drag.y),
      friction: (body, val) =>
        body.setFriction(val.x ?? body.friction.x, val.y ?? body.friction.y),
      gravity: (body, val) =>
        body.setGravity(val.x ?? body.gravity.x, val.y ?? body.gravity.y),
      circle: (body, { radius, offset }) =>
        body.setCircle(radius, offset.x, offset.y),
      size: (body, { width, height, center }) => {
        body.setSize(width ?? body.width, height ?? body.height, center)
      },
      offset: (body, { x, y }) =>
        body.setOffset(x ?? body.offset.x, y ?? body.offset.y),
      velocity: (body, val) =>
        body.setVelocity(val.x ?? body.velocity.x, val.y ?? body.velocity.y),
      maxVelocity: (body, val) =>
        body.setMaxVelocity(
          val.x ?? body.maxVelocity.x,
          val.y ?? body.maxVelocity.y
        ),
    })
  }

  onCleanup(() => {
    if (scene.children.exists(instance)) {
      scene.physics.world.disable(instance)
    }
  })

  return props.children
}

export interface AccelerationProps {
  /**
   * Sets the Body's acceleration in pixels per second squared
   */
  acceleration?: XY
}

export interface AngularProps {
  /**
   * The Body's angular acceleration (change in angular velocity), in degrees per second squared.
   */
  angularAcceleration?: number
  /**
   * Loss of angular velocity due to angular movement, in degrees per second.
   *
   * Angular drag is applied only when angular acceleration is zero.
   */
  angularDrag?: number
  /**
   * The rate of change of this Body's `rotation`, in degrees per second.
   */
  angularVelocity?: number
}

export interface BounceProps {
  /**
   * Sets the Body's bounce.
   */
  bounce?: XY
}

export interface DebugProps {
  debugBodyColor?: number
  debugShowBody?: boolean
  debugShowVelocity?: boolean
}

export interface DragProps {
  /**
   * If this Body is using `drag` for deceleration this property controls how the drag is applied.
   * If set to `true` drag will use a damping effect rather than a linear approach. If you are
   * creating a game where the Body moves freely at any angle (i.e. like the way the ship moves in
   * the game Asteroids) then you will get a far smoother and more visually correct deceleration
   * by using damping, avoiding the axis-drift that is prone with linear deceleration.
   *
   * If you enable this property then you should use far smaller `drag` values than with linear, as
   * they are used as a multiplier on the velocity. Values such as 0.95 will give a nice slow
   * deceleration, where-as smaller values, such as 0.5 will stop an object almost immediately.
   */
  damping?: number

  /**
   * Sets the Body's horizontal drag in pixels per second squared
   */
  drag?: XY

  /**
   * Enables or disables drag.
   */
  allowDrag?: boolean
}

export interface EnableProps {
  disableBody?: boolean
}

export interface FrictionProps {
  /**
   * Sets the Body's friction.
   */
  friction?: XY
}

export interface GravityProps {
  /**
   * Enables or disables gravity's effect on this Body.
   */
  allowGravity?: boolean
  /**
   * Sets the Body's gravity in pixels per second squared
   */
  gravity?: XY
}

export interface ImmovableProps {
  /**
   * Whether this Body can be moved by collisions with another Body.
   */
  immovable?: boolean
}

export interface MassProps {
  /**
   * Sets the Mass of the StaticBody. Will set the Mass to 0.1 if the value passed is less than or equal to zero.
   */
  mass?: number
}

export interface SizeProps {
  /**
   * Sizes and positions this Body, as a circle.
   */
  circle?: {
    radius: number

    /**
     * The horizontal and vertical offset of the Body from its Game Object, in source pixels.
     */
    offset?: XY
  }

  /**
   * Sets the body offset. This allows you to adjust the difference between the center of the body
   * and the x and y coordinates of the parent Game Object.
   */
  offset?: XY

  /**
   * Sizes and positions this Body, as a rectangle.
   * Modifies the Body `offset` if `center` is true (the default).
   * Resets the width and height to match current frame, if no width and height provided and a frame is found.
   */
  size?: {
    /**
     * The width of the Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame width.
     */
    width: number

    /**
     * The height of the Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame height.
     */
    height: number

    /**
     * Modify the Body's `offset`, placing the Body's center on its Game Object's center. Only works if the Game Object has the `getCenter` method. Default true.
     */
    center?: boolean
  }
}

export interface VelocityProps {
  /**
   * Sets the Body's velocity in pixels per second
   */
  velocity?: XY
  /**
   * Sets the Body's maximum velocity
   */
  maxVelocity?: XY
}
