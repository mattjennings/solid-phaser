import Phaser from "phaser";
import {
  children,
  onCleanup,
  createContext,
  useContext,
  splitProps,
  Show,
  createSignal,
  JSX,
} from "solid-js";
import { useGame } from "./Game";
import { Assets, loadAssets } from "./util/assets";

const SceneContext = createContext<Phaser.Scene>();

export const useScene = () => {
  const scene = useContext(SceneContext);

  if (!scene) {
    throw new Error(`No parent <Scene /> component found`);
  }

  return scene;
};

export interface SceneProps extends Phaser.Types.Scenes.SettingsConfig {
  key: string;
  assets?: Assets;

  /**
   * Use this callback to load assets.
   *
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin.
   * After this method completes, if the LoaderPlugin's queue isn't empty,
   * the LoaderPlugin will start automatically.
   *
   * It is called with the Phaser.Scene scene as the parameter.
   * @type {function}
   */
  preload?: (scene: Phaser.Scene) => any;

  /**
   * Use this callback to create any other assets needed by the scene (animations, etc).
   *
   * This method is called by the Scene Manager when the scene starts, after init() and preload().
   * If the LoaderPlugin started after preload(), then this method is called only after loading is complete.
   *
   * It is called with the Phaser.Scene scene as the parameter.
   * @type {function}
   */
  create?: (scene: Phaser.Scene) => any;

  /**
   * Called with the Scene Manager update loop
   *
   * @type {function}
   */
  update?: (scene: Phaser.Scene) => any;

  /**
   * This method is called by the Scene Manager when the scene starts,
   * before preload() and create().
   *
   * It is called with the Phaser.Scene scene as the parameter.
   * @type {function}
   */
  init?: (scene: Phaser.Scene) => any;

  children?: JSX.Element;
}

export default function Scene(props: SceneProps) {
  const [local, config] = splitProps(props, [
    "children",
    "assets",
    "preload",
    "create",
    "init",
    "update",
  ]);
  const game = useGame();
  const scene = new Phaser.Scene({ ...config });

  onCleanup(() => game.scene.remove(config.key));

  let [loading, setLoading] = createSignal(true);
  let [loadingProgress, setLoadingProgress] = createSignal(0);

  // @ts-ignore
  scene.preload = () => {
    local.preload?.(scene);
    if (local.assets) {
      loadAssets(scene, local.assets);
    }

    // if there are no assets to load, emit the complete event
    if (!scene.load.list.size) {
      setLoading(false);
      scene.load.emit(Phaser.Loader.Events.COMPLETE);
    }
  };

  (scene as any).create = local.create ? () => local.create(scene) : null;

  (scene as any).init = local.init ? () => local.init(scene) : null;

  scene.update = local.update ? () => local.update(scene) : null;

  game.scene.add(config.key, scene, true);

  scene.load.on("progress", (progress) => {
    setLoadingProgress(progress);
  });
  scene.load.on("complete", () => {
    setLoading(false);
    setLoadingProgress(100);
  });

  return (
    <SceneContext.Provider value={scene}>
      <Show when={!loading()}>{local.children}</Show>
    </SceneContext.Provider>
  );
}
