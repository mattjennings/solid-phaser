import {
  createResource,
  JSX,
  createEffect,
  splitProps,
  Show,
  createMemo,
} from 'solid-js'
import { createSignal, createContext, useContext, on } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Scene } from 'solid-phaser'
import type { SceneProps } from '../Scene'

export type SceneConfig = Omit<SceneProps, 'key'>
interface RouterProps {
  children: JSX.Element
  scenes: Record<
    string,
    {
      component: () => JSX.Element
      initial: boolean
      props: Partial<SceneProps>
    }
  >
}

const RouterContext = createContext<{
  goto: (scene: string) => void
  restart: () => void
}>({
  goto: () => void 0,
  restart: () => void 0,
})

export function Router(props: RouterProps) {
  const [hash, setHash] = createSignal(Date.now())
  const [location, setLocation] = createSignal(
    Object.keys(props.scenes).find((key) => !!props.scenes[key].initial) ??
      Object.keys(props.scenes)[0]
  )

  function goto(scene: string) {
    if (!props.scenes[scene]) {
      throw new Error(`No scene with name ${scene} found`)
    }

    setLocation(scene)
    setHash(Date.now())
  }

  function restart() {
    setHash(Date.now())
  }

  return (
    <RouterContext.Provider value={{ goto, restart }}>
      <LoadScene
        key={`${location()}-${hash()}`}
        component={props.scenes[location()].component}
      />
    </RouterContext.Provider>
  )
}

function LoadScene(props) {
  const [component] = createResource<{
    default: () => JSX.Element
    config?: SceneConfig
  }>(() => props.component())

  const sceneProps = createMemo(() => {
    if (component()) {
      const { config } = component()
      return config
    }

    return {}
  })

  return (
    <Show when={component()?.default}>
      <Show when={props.key}>
        {(key) => (
          <Scene key={key} {...sceneProps()}>
            <Dynamic component={component()?.default} />
          </Scene>
        )}
      </Show>
    </Show>
  )
}

export function useRouter() {
  return useContext(RouterContext)
}
