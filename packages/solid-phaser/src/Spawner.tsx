import {
  createContext,
  createSignal,
  JSX,
  For,
  useContext,
  Component,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'

interface SpawnerContextValue {
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
    props: Omit<T, 'children' | keyof SpawnedProps>
  ) => number

  /**
   * Destroys the spawned component
   */
  destroy: (id: number) => void
}

export interface SpawnedProps {
  /**
   * Called by the component to destroy itself
   **/
  onDestroy: () => void

  /**
   * ID of the spawned component
   **/
  spawnId: number
}

const SpawnerContext = createContext<SpawnerContextValue>()
export const useSpawner = () => useContext(SpawnerContext)

export function Spawner(props: { children?: JSX.Element }) {
  let nextId = 0
  // let [nextId, setNextId] = createSignal(0)
  const [instances, setInstances] = createSignal<
    SpawnerContextValue['instances']
  >([])

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

  function destroy(id: number) {
    setInstances((p) => p.filter((i) => i.id !== id))
  }

  return (
    <SpawnerContext.Provider value={{ instances: instances(), spawn, destroy }}>
      <For each={instances()}>
        {(instance) => {
          return (
            <Dynamic
              component={instance.component}
              {...instance.props}
              spawnId={instance.id}
              onDestroy={() => {
                destroy(instance.id)
              }}
            />
          )
        }}
      </For>
      {props.children}
    </SpawnerContext.Provider>
  )
}
