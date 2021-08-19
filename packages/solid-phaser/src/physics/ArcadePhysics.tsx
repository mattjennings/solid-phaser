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

export function ArcadePhysics(props: ArcadePhysicsProps) {
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
      acceleration: (body, val) => body.setAcceleration(val, val),
      accelerationX: (body, val) => body.setAccelerationX(val),
      accelerationY: (body, val) => body.setAccelerationY(val),
      bounce: (body, val) => body.setBounce(val, val),
      bounceX: (body, val) => body.setBounceX(val),
      bounceY: (body, val) => body.setBounceY(val),
      drag: (body, val) => body.setDrag(val, val),
      dragX: (body, val) => body.setDragX(val),
      dragY: (body, val) => body.setDragY(val),
      friction: (body, val) => body.setFriction(val, val),
      frictionX: (body, val) => body.setFrictionX(val),
      frictionY: (body, val) => body.setFrictionY(val),
      gravity: (body, val) => body.setGravity(val, val),
      gravityX: (body, val) => body.setGravityX(val),
      gravityY: (body, val) => body.setGravityY(val),
      circle: (body, { radius, offsetX, offsetY }) =>
        body.setCircle(radius, offsetX, offsetY),
      size: (body, { width, height, center }) =>
        body.setSize(width, height, center),
      offset: (body, { x, y }) =>
        body.setOffset(x ?? body.offset.x, y ?? body.offset.y),
      velocity: (body, val) => body.setVelocity(val, val),
      velocityX: (body, val) => body.setVelocityX(val),
      velocityY: (body, val) => body.setVelocityY(val),
      maxVelocity: (body, val) => body.setMaxVelocity(val, val),
      maxVelocityX: (body, val) => body.setMaxVelocityX(val),
      maxVelocityY: (body, val) => body.setMaxVelocityY(val),
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
   * Sets the Body's X and Y acceleration in pixels per second squared
   */
  acceleration?: number

  /**
   * Sets the Body's horizontal acceleration in pixels per second squared
   */
  accelerationX?: number

  /**
   * Sets the Body's vertical acceleration in pixels per second squared
   */
  accelerationY?: number
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
   * Sets the Body's X and Y bounce.
   */
  bounce?: number

  /**
   * Sets the Body's horizontal bounce.
   */
  bounceX?: number

  /**
   * Sets the Body's vertical bounce.
   */
  bounceY?: number
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
   * Sets the Body's X and Y drag in pixels per second squared
   */
  drag?: number

  /**
   * Sets the Body's horizontal drag in pixels per second squared
   */
  dragX?: number

  /**
   * Sets the Body's vertical drag in pixels per second squared
   */
  dragY?: number

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
   * Sets the Body's X and Y friction.
   */
  friction?: number

  /**
   * Sets the Body's horizontal friction.
   */
  frictionX?: number

  /**
   * Sets the Body's vertical friction.
   */
  frictionY?: number
}

export interface GravityProps {
  /**
   * Enables or disables gravity's effect on this Body.
   */
  allowGravity?: boolean

  /**
   * Sets the Body's X and Y gravity in pixels per second squared
   */
  gravity?: number

  /**
   * Sets the Body's horizontal gravity in pixels per second squared
   */
  gravityX?: number

  /**
   * Sets the Body's vertical gravity in pixels per second squared
   */
  gravityY?: number
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
     * The horizontal  offset of the Body from its Game Object, in source pixels.
     */
    offsetX?: number

    /**
     * The vertical offset of the Body from its Game Object, in source pixels.
     */
    offsetY?: number
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
   * Sets the Body's X and Y velocity in pixels per second
   */
  velocity?: number

  /**
   * Sets the Body's horizontal velocity in pixels per second
   */
  velocityX?: number

  /**
   * Sets the Body's vertical velocity in pixels per second
   */
  velocityY?: number

  /**
   * Sets the Body's X and Y maximum velocity
   */
  maxVelocity?: number

  /**
   * Sets the Body's horizontal maximum velocity
   */
  maxVelocityX?: number

  /**
   * Sets the Body's vertical maximum velocity
   */
  maxVelocityY?: number
}
