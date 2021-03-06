import {
  Component,
  createContext,
  JSX,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
  useContext,
} from 'solid-js'
import { Spawner, SpawnerProps, SpawnerValue } from '../Spawner'
import { useScene } from '../Scene'
import { Ref, RefFunction } from '../types'
import { ComposedGameObjectProps, GameObject } from './GameObject'
import {
  AlphaProps,
  BlendModeProps,
  ComputedSizeProps,
  CropProps,
  DepthProps,
  FlipProps,
  MaskProps,
  OriginProps,
  PipelineProps,
  ScrollFactorProps,
  TintProps,
  TransformProps,
  VisibleProps,
  XY,
} from './props'

const TilemapContext = createContext<Phaser.Tilemaps.Tilemap>(null)
export const useTilemap = () => useContext(TilemapContext)

export interface TilemapProps {
  ref?: Ref<Phaser.Tilemaps.Tilemap>

  /**
   * The key of the tilemap asset. This should be preloaded in the Scene's preload.
   */
  key?: string

  tiled?: {
    name: string
    data: any
  }

  data?: Phaser.Tilemaps.MapData

  /**
   * A mapping of tileset names in Tiled to the Phaser asset key
   */
  tilesets: Record<string, string>

  /**
   * TilemapTileLayers will be assigned `depth` values to reflect the layer order in the tilemap
   */
  useLayerOrder?: boolean

  /**
   * If useLayerOrder is true, the layer depths will start at this number and increment
   * by 1
   */
  startingDepth?: number

  children?: JSX.Element
}

export function Tilemap(p: TilemapProps) {
  const props = mergeProps(
    {
      useLayerOrder: true,
      startingDepth: 0,
    },
    p
  )
  const scene = useScene()

  let instance: Phaser.Tilemaps.Tilemap
  let data = props.data

  if (props.key) {
    instance = scene.make.tilemap({ key: props.key })
    data = scene.cache.tilemap.get(props.key)?.data
    if (!data) {
      throw new Error(
        `Unable to find tilemap "${props.key}". Has it been preloaded?`
      )
    }
  } else if (props.tiled) {
    data = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(
      props.tiled.name,
      props.tiled.data,
      true
    )
    instance = new Phaser.Tilemaps.Tilemap(scene, data)
  } else if (data) {
    instance = new Phaser.Tilemaps.Tilemap(scene, data)
  }

  if (!instance) {
    throw new Error(
      'Tilemap instance could not be created - provide a `key`, `tiled`, or `data` prop'
    )
  }

  ;(props.ref as RefFunction)?.(instance)

  Object.entries(props.tilesets).forEach(([name, tilesetKey]) => {
    if (scene.textures.get(tilesetKey).key === '__MISSING') {
      throw new Error(
        `Unable to find tileset "${name}" for tilemap "${props.key}". Has it been preloaded?`
      )
    }
    instance.addTilesetImage(name, tilesetKey)
  })

  if (scene.physics?.world) {
    const width =
      scene.physics.world.bounds.width < instance.widthInPixels
        ? instance.widthInPixels
        : scene.physics.world.bounds.width
    const height =
      scene.physics.world.bounds.height < instance.heightInPixels
        ? instance.heightInPixels
        : scene.physics.world.bounds.height
    scene.physics.world.bounds.setSize(width, height)
  }

  onCleanup(() => {
    instance.destroy()
  })

  // set some properties on the instance for use by layer components
  // @ts-ignore
  instance.layerOrder = (data.layers as Phaser.Tilemaps.LayerData[]).map(
    (layer) => layer.name
  )
  // @ts-ignore
  instance.useLayerOrder = props.useLayerOrder
  // @ts-ignore
  instance.startingDepth = props.startingDepth

  return (
    <TilemapContext.Provider value={instance}>
      {props.children}
    </TilemapContext.Provider>
  )
}

/////////////////////////////
//    Tilemap.TileLayer   //
//////////////////////////

export interface TileLayerProps
  extends ComposedGameObjectProps<Phaser.Tilemaps.TilemapLayer>,
    AlphaProps,
    BlendModeProps,
    ComputedSizeProps,
    CropProps,
    DepthProps,
    FlipProps,
    MaskProps,
    OriginProps,
    PipelineProps,
    ScrollFactorProps,
    TintProps,
    TransformProps,
    VisibleProps {
  /**
   * The layer array index value, or the layer name from Tiled
   */
  id: number | string

  /**
   * Sets collision on the given tile or tiles within a layer by index.
   */
  collision?: number | number[]

  /**
   * Sets collision on a range of tiles in a layer whose index is between the specified start and stop (inclusive).
   * Calling this with a start value of 10 and a stop value of 14 would set collision for tiles 10, 11, 12, 13 and 14.
   */
  collisionBetween?: [number, number]

  /**
   * Sets collision on all tiles in the given layer, except for tiles that have an index specified in the given array.
   */
  collisionByExclusion?: [number, number]

  /**
   * Sets collision on the tiles within a layer by checking tile properties.
   * If a tile has a property that matches the given properties object,
   * its collision flag will be set.
   *
   * Providing an object with a key of "collides" and a value of `true` would check
   * for any tile with a "collides" property that equals `true`. You can also pass in
   * an array for the property value, and it will check if the tile property value is any of those.
   */
  collisionByProperty?: object

  /**
   * Canvas only.
   *
   * The amount of extra tiles to add into the cull rectangle when calculating its size.
   */
  cullPadding?: XY

  /**
   * Canvas only.
   *
   * You can control if the Cameras should cull tiles before rendering them or not.
   * By default the camera will try to cull the tiles in this layer, to avoid over-drawing to the renderer.
   *
   * However, there are some instances when you may wish to disable this, and toggling this flag allows you to do so.
   */
  skipCull?: boolean
}

Tilemap.TileLayer = function TileLayer(props: TileLayerProps) {
  const tilemap = useTilemap()

  const tilesets = tilemap.tilesets
  let depth = props.depth

  // @ts-ignore
  if (tilemap.useLayerOrder && typeof depth === 'undefined') {
    depth =
      // @ts-ignore
      tilemap.layerOrder.findIndex((layerName) => layerName === props.id) +
      // @ts-ignore
      tilemap.startingDepth
  }

  return (
    <GameObject
      create={() => {
        return tilemap.createLayer(props.id, tilesets, props.x, props.y)
      }}
      destroy={(instance) => {
        // don't remove from tilemap, otherwise layer cannot be mounted again later
        instance.destroy(false)
      }}
      applyProps={{
        collision: (instance, val) => instance.setCollision(val),
        collisionBetween: (instance, val) =>
          instance.setCollisionBetween(val[0], val[1]),
        collisionByExclusion: (instance, val) =>
          instance.setCollisionByExclusion(val),
        collisionByProperty: (instance, val) =>
          instance.setCollisionByProperty(val),
        cullPadding: (instance, val) => instance.setCullPadding(val.x, val.y),
        skipCull: (instance, val) => instance.setSkipCull(val),
      }}
      {...props}
      depth={depth}
    />
  )
}

export interface ObjectLayerProps extends Omit<SpawnerProps, 'ref'> {
  /**
   * The mapping for components that this layer will render
   *
   * @type {object}
   */
  components: Record<string, Component<any>>

  /**
   * The layer array index value, or the layer name from Tiled
   */
  id: number | string

  /**
   * The depth for each component in this layer
   */
  depth?: number

  children?: JSX.Element
}
Tilemap.ObjectLayer = function ObjectLayer(props: ObjectLayerProps) {
  const [local, rest] = splitProps(props, ['components', 'depth', 'id'])
  const tilemap = useTilemap()
  let spawner: SpawnerValue

  let depth = props.depth

  // @ts-ignore
  if (tilemap.useLayerOrder && typeof depth === 'undefined') {
    depth =
      // @ts-ignore
      tilemap.layerOrder.findIndex((layerName) => layerName === props.id) +
      // @ts-ignore
      tilemap.startingDepth
  }

  const layer = tilemap.objects.find((layer) => layer.name === props.id)

  onMount(() => {
    const components = props.components
    layer.objects.forEach(({ x, y, properties }) => {
      const { component, ...props } = properties.reduce(
        (total, prop) => ({ ...total, [prop.name]: prop.value }),
        {}
      )
      if (component && components[component]) {
        const c = components[component]

        spawner.spawn(c, {
          x,
          y,
          depth,
          ...props,
        })
      }
    })
  })

  return <Spawner ref={spawner} {...rest} />
}
