import { createSignal } from 'solid-js'
import {
  onGameEvent,
  Rectangle,
  RectangleProps,
  useCamera,
  useSpawner,
} from 'solid-phaser'
import Enemy from './Enemy'

export default function EnemySpawner(props: RectangleProps) {
  let ref: Phaser.GameObjects.Rectangle
  const camera = useCamera()
  const spawner = useSpawner()

  const [prevView, setPrevView] = createSignal<Phaser.Geom.Rectangle>(null)
  const [spawned, setSpawned] = createSignal(false)

  onGameEvent(Phaser.Core.Events.STEP, () => {
    const view = new Phaser.Geom.Rectangle(
      camera.worldView.left - camera.width / 2,
      camera.worldView.top - camera.height / 2,
      camera.worldView.width + camera.width / 2,
      camera.worldView.height + camera.height / 2
    )

    if (view.contains(ref.x, ref.y) && !prevView()?.contains(ref.x, ref.y)) {
      if (!spawned()) {
        setSpawned(true)
        spawner.spawn(Enemy, {
          x: ref.x,
          y: ref.y,
          onDestroy: () => {
            setSpawned(false)
          },
        })
      }
    }

    setPrevView(view)
  })

  return <Rectangle ref={ref} width={20} height={20} {...props} />
}
