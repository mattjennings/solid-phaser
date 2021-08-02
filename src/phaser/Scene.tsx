import Phaser from "phaser";
import {
  children,
  onCleanup,
  createContext,
  useContext,
  splitProps,
  Show,
  createSignal,
} from "solid-js";
import { useGame } from "./Game";

const SceneContext = createContext<Phaser.Scene>();

export const useScene = () => useContext(SceneContext);

export interface SceneProps extends Phaser.Types.Scenes.SettingsConfig {
  key: string;
}

export default function Scene<SceneProps>(props) {
  const [local, config] = splitProps(props, ["children"]);
  const game = useGame();
  const scene = new Phaser.Scene({ ...config });

  onCleanup(() => game.scene.remove(config.key));

  let [loading, setLoading] = createSignal(true);

  // @ts-ignore
  scene.preload = () => {
    // preload?.(instance)
    // if (assets) {
    //   loadAssets(instance, assets)
    // }

    // if there are no assets to load, emit the complete event
    if (!scene.load.list.size) {
      setLoading(false);
      scene.load.emit(Phaser.Loader.Events.COMPLETE);
    }
  };

  game.scene.add(config.key, scene, true);

  scene.load.on("progress", (progress) => {
    // loadingProgress = progress
  });
  scene.load.on("complete", () => {
    setLoading(false);
    // loadingProgress = 100
  });

  return (
    <SceneContext.Provider value={scene}>
      <Show when={!loading()}>{local.children}</Show>
    </SceneContext.Provider>
  );
}
