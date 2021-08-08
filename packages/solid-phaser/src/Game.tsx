import Phaser from "phaser";
import {
  onCleanup,
  createContext,
  useContext,
  splitProps,
  createSignal,
  Show,
  JSX,
} from "solid-js";
import { Ref, RefFunction } from "./types";

const GameContext = createContext<Phaser.Game>();

export const useGame = () => {
  const game = useContext(GameContext);

  if (!game) {
    throw new Error(`No parent <Game /> component found`);
  }

  return game;
};

export interface GameProps extends Phaser.Types.Core.GameConfig {
  ref?: Ref<Phaser.Game>;
  children?: JSX.Element;
}

/**
 * Creates a new Phaser.Game instance
 **/
export default function Game(props: GameProps) {
  const [local, config] = splitProps(props, ["children"]);
  const game = new Phaser.Game({ ...config });

  (props.ref as RefFunction)?.(game);

  onCleanup(() => game.destroy(true));

  let [booting, setBooting] = createSignal(!game.isRunning);

  game.events.on("ready", () => {
    setBooting(false);
  });

  return (
    <GameContext.Provider value={game}>
      <Show when={!booting()}>{local.children}</Show>
    </GameContext.Provider>
  );
}
