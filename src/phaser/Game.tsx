import Phaser from "phaser";
import {
  children,
  onCleanup,
  createContext,
  useContext,
  splitProps,
  createSignal,
  Show,
} from "solid-js";

const GameContext = createContext<Phaser.Game>();

export const useGame = () => useContext(GameContext);

export default function Game(props) {
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
