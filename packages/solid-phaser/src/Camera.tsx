import {
  createContext,
  JSX,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
  useContext,
} from 'solid-js'
import { onSceneEvent } from './events'
import { useTilemap } from './game-objects'
import {
  AlphaProps,
  applyAlphaProps,
  applyTintProps,
  FlipProps,
  TintProps,
  XY,
} from './game-objects/props'
import { useScene } from './Scene'
import { Ref, RefFunction } from './types'

import { createApplyPropsEffect } from './util/createApplyPropsEffect'
import { getGameObjectsByName } from './util/getGameObjectsByName'

const CameraContext = createContext<Phaser.Cameras.Scene2D.Camera>()

/**
 * Gets the current <Camera /> instance. If there is no parent <Camera />,
 * it will return the scene's main camera instead
 **/
export const useCamera = () => {
  const scene = useScene()
  return useContext(CameraContext) ?? scene.cameras.main
}

export interface CameraProps extends AlphaProps, TintProps, FlipProps {
  ref?: Ref<Phaser.Cameras.Scene2D.Camera>

  children?: JSX.Element

  /**
   * The background color of this Camera. Only used if transparent is false.
   */
  backgroundColor?: string | number

  /**
   * Set the bounds of the Camera. The bounds are an axis-aligned rectangle. If this Camera is inside of a
   * `<Tilemap />`, it will default to the bounds of the tilemap.
   *
   * The Camera bounds controls where the Camera can scroll to, stopping it from scrolling off the e
   * dges and into blank space. It does not limit the placement of Game Objects, or where the Camera viewport can
   * be positioned.
   *
   * If you set bounds that are smaller than the viewport it will stop the Camera from being able to scroll.
   * The bounds can be positioned where-ever you wish. By default they are from 0x0 to the canvas width x height.
   * This means that the coordinate 0x0 is the top left of the Camera bounds. However, you can position them anywhere.
   * So if you wanted a game world that was 2048x2048 in size, with 0x0 being the center of it, you can set the bounds x/y
   * to be -1024, -1024, with a width and height of 2048. Depending on your game you may find it easier for 0x0 to be the
   * top-left of the bounds, or you may wish 0x0 to be the middle.
   */
  bounds?: {
    /**
     * The top-left x coordinate of the bounds.
     **/
    x?: number

    /**
     * The top-left y coordinate of the bounds.
     **/
    y?: number

    /**
     * The width of the bounds, in pixels.
     */
    width: number

    /**
     * The height of the bounds, in pixels.
     */
    height: number

    /**
     * If true the Camera will automatically be centered on the new bounds
     */
    center?: boolean
  }

  /**
   * The game object to follow. It can be the name of a game object, or a game object
   * instance
   */
  follow?: string | Phaser.GameObjects.GameObject

  /**
   * The offset while following the target
   */
  followOffset?: XY

  /**
   * The height of the Camera viewport, in pixels.
   * The viewport is the area into which the Camera renders.
   * Setting the viewport does not restrict where the Camera can scroll to.
   */
  height?: number

  /**
   * Does this Camera allow the Game Objects it renders to receive input events?
   *
   */
  inputEnabled?: boolean

  /**
   * Sets the linear interpolation value to use when following a target.
   *
   * The default values of 1 means the camera will instantly snap to the target coordinates.
   * A lower value, such as 0.1 means the camera will more slowly track the target, giving a
   * smooth transition. You can set the horizontal and vertical values independently, and also adjust this value in real-time during your game.
   *
   * Be sure to keep the value between 0 and 1. A value of zero will disable tracking on that axis.
   */
  lerp?: number | XY

  /**
   * The Mask this Camera is using during render.
   */
  mask?: Phaser.Display.Masks.BitmapMask | Phaser.Display.Masks.GeometryMask

  /**
   * Makes this component control the default camera that is created with the scene.
   * Defaults to true. If false, it will add a new one to the scene.
   */
  main?: boolean

  /**
   * The name of the Camera. This is for your own use.
   */
  name?: string

  /**
   * The horizontal origin of rotation for this Camera.
   *
   * By default the camera rotates around the center of the viewport.
   *
   * Changing the origin allows you to adjust the point in the viewport
   * from which rotation happens. A value of 0 would rotate from the
   * top-left of the viewport. A value of 1 from the bottom right.
   */
  originX?: number

  /**
   * The vertical origin of rotation for this Camera.
   *
   * By default the camera rotates around the center of the viewport.
   *
   * Changing the origin allows you to adjust the point in the viewport
   * from which rotation happens. A value of 0 would rotate from the
   * top-left of the viewport. A value of 1 from the bottom right.
   */
  originY?: number

  /**
   * Should this camera round its pixel values to integers?
   */
  roundPixels?: boolean

  /**
   * The horizontal scroll position of this Camera.
   *
   * Change this value to cause the Camera to scroll around your Scene.
   *
   * Alternatively, setting the Camera to follow a Game Object will automatically
   * adjust the Camera scroll values accordingly.
   */
  scrollX?: number

  /**
   * The vertical scroll position of this Camera.
   *
   * Change this value to cause the Camera to scroll around your Scene.
   *
   * Alternatively, setting the Camera to follow a Game Object will automatically
   * adjust the Camera scroll values accordingly.
   */
  scrollY?: number

  /**
   * Sets a transparent background on the Camera
   */
  transparent?: boolean

  /**
   * A visible camera will render and perform input tests.
   * An invisible camera will not render anything and will skip input tests.
   */
  visible?: boolean

  /**
   * The Camera zoom value. Change this value to zoom in, or out of, a Scene.
   *
   * A value of 0.5 would zoom the Camera out, so you can now see twice as
   * much of the Scene as before. A value of 2 would zoom the Camera in,
   * so every pixel now takes up 2 pixels when rendered.
   *
   * Set to 1 to return to the default zoom level.
   *
   * Be careful to never set this value to zero.
   */
  zoom?: number

  /**
   * The Camera horizontal zoom value. Change this value to zoom in, or out of, a Scene.
   *
   * A value of 0.5 would zoom the Camera out, so you can now see twice as
   *  much of the Scene as before. A value of 2 would zoom the Camera in,
   * so every pixel now takes up 2 pixels when rendered.
   *
   * Set to 1 to return to the default zoom level.
   *
   * Be careful to never set this value to zero.
   */
  zoomX?: number

  /**
   * The Camera vertical zoom value. Change this value to zoom in, or out of, a Scene.
   *
   * A value of 0.5 would zoom the Camera out, so you can now see twice as
   * much of the Scene as before. A value of 2 would zoom the Camera in,
   * so every pixel now takes up 2 pixels when rendered.
   *
   * Set to 1 to return to the default zoom level.
   *
   * Be careful to never set this value to zero.
   */
  zoomY?: number

  /**
   * The width of the Camera viewport, in pixels.
   *
   * The viewport is the area into which the Camera renders.
   * Setting the viewport does not restrict where the Camera can scroll to.
   */
  width?: number

  /**
   * The x position of the Camera, relative to the top-left of the game canvas.
   *
   * This is only used when creating the camera. See the `scrollX` prop
   * for moving it.
   */
  x?: number

  /**
   * The y position of the Camera, relative to the top-left of the game canvas.
   *
   * This is only used when creating the camera. See the `scrollY` prop
   * for moving it.
   */
  y?: number

  /**
   * Called after camera is created and added to the scene
   */
  onCreate?: (self: Phaser.Cameras.Scene2D.Camera) => void

  /**
   * Called during the scene's update loop
   */
  onUpdate?: (
    self: Phaser.Cameras.Scene2D.Camera,
    time: number,
    delta: number
  ) => void

  /**
   * Called during the scene's preupdate loop
   */
  onPreUpdate?: (
    self: Phaser.Cameras.Scene2D.Camera,
    time: number,
    delta: number
  ) => void

  /**
   * Called during the scene's postupdate loop
   */
  onPostUpdate?: (
    self: Phaser.Cameras.Scene2D.Camera,
    time: number,
    delta: number
  ) => void
}

export function Camera(p: CameraProps) {
  const tilemap = useTilemap()
  const scene = useScene()

  const [local, props] = splitProps(
    mergeProps(
      {
        main: true,
        bounds: {
          x: 0,
          y: 0,
          width: tilemap?.widthInPixels ?? undefined,
          height: tilemap?.heightInPixels ?? undefined,
        },
      },
      p
    ),
    ['onCreate', 'onPreUpdate', 'onUpdate', 'onPostUpdate', 'main', 'ref']
  )

  const instance = local.main
    ? scene.cameras.main
    : new Phaser.Cameras.Scene2D.Camera(
        props.x,
        props.y,
        props.width,
        props.height
      )
  ;(local.ref as RefFunction)?.(instance)

  // we're adding a new camera
  if (!local.main) {
    scene.cameras.addExisting(instance, true)
  }

  local.onCreate?.(instance)

  function startFollow(
    target = typeof props.follow === 'string'
      ? getGameObjectsByName(scene, props.follow)[0]
      : props.follow
  ) {
    if (target) {
      // we need to set roundPixels etc. in startFollow otherwise they get overwritten by defaults inside
      // the startFollow method
      instance.startFollow(
        target,
        props.roundPixels,
        props.lerp &&
          (typeof props.lerp === 'number' ? props.lerp : props.lerp.x),
        props.lerp &&
          (typeof props.lerp === 'number' ? props.lerp : props.lerp.y),
        props.followOffset?.x ?? 0,
        props.followOffset?.y ?? 0
      )
    }
  }

  createApplyPropsEffect(instance, props, {
    ...applyAlphaProps,
    ...applyTintProps,
    follow: (instance, value) => startFollow(),
    followOffset: (instance, value) =>
      instance.setFollowOffset(value.x ?? 0, value.y ?? 0),
    bounds: (instance, value) =>
      instance.setBounds(
        value.x ?? 0,
        value.y ?? 0,
        value.width,
        value.height,
        value.center ?? false
      ),
    lerp: (instance, value) =>
      instance.setLerp(
        (typeof value === 'number' ? value : value.x) ?? 0,
        (typeof value === 'number' ? value : value.y) ?? 0
      ),
  })

  onSceneEvent(
    Phaser.Scenes.Events.ADDED_TO_SCENE,
    (object: Phaser.GameObjects.GameObject) => {
      if (object.name) {
        if (typeof props.follow === 'string' && props.follow === object.name) {
          startFollow(object)
        } else if (
          typeof props.follow === 'object' &&
          props.follow.name === object.name
        ) {
          startFollow(props.follow)
        }
      }
    }
  )

  onCleanup(() => {
    if (!local.main) {
      scene.cameras.remove(instance, true)
    }
  })

  ////////////////// EVENTS //////////////////////
  if (local.onUpdate) {
    const cb = (time, delta) => local.onUpdate(instance, time, delta)
    scene.events.on('update', cb)
  }

  if (local.onPreUpdate) {
    const cb = (time, delta) => local.onPreUpdate(instance, time, delta)
    scene.events.on('preupdate', cb)
  }

  if (local.onPostUpdate) {
    const cb = (time, delta) => local.onPostUpdate(instance, time, delta)
    scene.events.on('postupdate', cb)
  }

  return (
    <CameraContext.Provider value={instance}>
      {props.children}
    </CameraContext.Provider>
  )
}
