import {
  createResource,
  JSX,
  createEffect,
  splitProps,
  Show,
  createMemo,
} from 'solid-js'
import { createSignal, createContext, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'
// @ts-ignore
import { Scene, SceneProps } from 'solid-phaser'

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
  const [component] = createResource<
    { default: JSX.Element } & Partial<SceneProps>
  >(() => props.component())

  const sceneProps = createMemo(() => {
    if (component()) {
      const { default: _, $HotComponent: __, ...p } = component()
      return p
    }

    return {}
  })

  return (
    <Show when={component()?.default}>
      <Scene key={props.key} {...sceneProps()}>
        <Dynamic component={component()?.default} />
      </Scene>
    </Show>
  )
}

export function useRouter() {
  return useContext(RouterContext)
}
