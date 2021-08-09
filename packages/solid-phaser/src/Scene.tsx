import Phaser from "phaser";
import {
  onCleanup,
  createContext,
  useContext,
  splitProps,
  Show,
  createSignal,
  JSX,
} from "solid-js";
import { Ref, RefFunction } from "./types";
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
  ref?: Ref<Phaser.Scene>;

  key: string;

  /**
   * An object describing the assets to preload for the scene. This can be used instead of or
   * in addition to preload.
   */
  assets?: Assets;

  /**
   * Called after init and before create. Use this to load any additional assets.
   */
  preload?: (scene: Phaser.Scene) => any;

  /**
   * Called after init and preload. Use this to create any other assets needed by the scene (animations, etc).
   */
  create?: (scene: Phaser.Scene) => any;

  /**
   * Called with the Scene Manager update loop
   */
  update?: (scene: Phaser.Scene) => any;

  /**
   * Called before preload and create
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

  (props.ref as RefFunction)?.(scene);

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
