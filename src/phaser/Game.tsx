import Phaser from "phaser";
import {
  children,
  onCleanup,
  createContext,
  useContext,
  splitProps,
  createSignal,
  Show,
  JSX,
} from "solid-js";
import { createApplyPropsEffect } from "./util/createApplyPropsEffect";

const GameContext = createContext<Phaser.Game>();

export const useGame = () => useContext(GameContext);

export interface GameProps extends Phaser.Types.Core.GameConfig {
  children?: JSX.Element;
}

export default function Game(props: GameProps) {
  const [local, config] = splitProps(props, ["children"]);
  const game = new Phaser.Game({ ...config });

  // @ts-ignore
  window.game = game;

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
