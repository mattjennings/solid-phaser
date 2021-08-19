import {
  createContext,
  createSignal,
  JSX,
  For,
  useContext,
  Component,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Ref, RefFunction } from 'solid-phaser'

const SpawnerContext = createContext<SpawnerValue>()
export const useSpawner = () => useContext(SpawnerContext)

export interface SpawnerValue {
  instances: Array<{
    id: number
    props: any
    component: () => JSX.Element
  }>
  /**
   * Spawns the component with the props. Returns the unique id of the spawn
   */
  spawn: <T>(
    component: Component<T>,
    props: Omit<T, 'children' | keyof SpawnProps>
  ) => number

  /**
   * Destroys the spawned component
   */
  destroy: (id: number) => void
}

export interface SpawnProps {
  /**
   * Called by the component to destroy itself
   **/
  onDestroy: (detail?: any) => void

  /**
   * ID of the spawned component
   **/
  spawnId: number
}

export interface SpawnerProps {
  ref?: Ref<SpawnerValue>
  children?: JSX.Element
  onDestroy?: (instance: unknown, id: number, detail?: any) => void
}

export function Spawner(props: SpawnerProps) {
  let nextId = 0
  // let [nextId, setNextId] = createSignal(0)
  const [instances, setInstances] = createSignal<SpawnerValue['instances']>([])

  function spawn(component, props) {
    const id = ++nextId
    setInstances((p) => [
      ...p,
      {
        component,
        props,
        id,
      },
    ])

    return id
  }

  function destroy(id: number, detail?: any) {
    const index = instances().findIndex((i) => i.id === id)
    setInstances((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
    props.onDestroy?.(instances()[index], id, detail)
  }

  const value = { instances: instances(), spawn, destroy }
  ;(props.ref as RefFunction)?.(value)
  return (
    <SpawnerContext.Provider value={value}>
      <For each={instances()}>
        {(instance) => {
          return (
            <Dynamic
              component={instance.component}
              {...instance.props}
              spawnId={instance.id}
              onDestroy={(detail) => {
                destroy(instance.id, detail)
              }}
            />
          )
        }}
      </For>
      {props.children}
    </SpawnerContext.Provider>
  )
}
