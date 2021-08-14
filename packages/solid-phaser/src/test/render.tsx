import { Component, createSignal } from "solid-js";
import { render as _render, waitFor } from "solid-testing-library";
import { Game, GameProps } from "../core/Game";
import { Scene, SceneProps } from "../core/Scene";

export async function render(
  component: Component,
  config: {
    paused?: boolean;
    game?: Partial<GameProps>;
    scene?: Partial<SceneProps>;
  } = {}
) {
  let game: Phaser.Game;
  let scene: Phaser.Scene;

  const [elapsedFrames, setElapsedFrames] = createSignal(0);

  const C = component;

  _render(() => (
    <Game
      ref={game}
      width={400}
      height={400}
      type={Phaser.HEADLESS}
      banner={false}
      {...(config.game ?? {})}
    >
      <Scene
        ref={scene}
        key="test-scene"
        {...(config.scene ?? {})}
        init={(scene) => {
          config.scene?.create?.(scene);
          if (config.paused) {
            scene.scene.pause();
          }
        }}
      >
        <C />
      </Scene>
    </Game>
  ));

  await waitFor(() => {
    if (!game) {
      throw new Error(`Game was unable to mount`);
    }

    if (!scene) {
      throw new Error(`Scene was unable to mount`);
    }

    scene.events.on("preupdate", () => {
      setElapsedFrames((p) => p + 1);
    });
  });

  async function waitFrames(frames: number) {
    return new Promise((res) => {
      const starting = elapsedFrames();

      const update = () => {
        if (elapsedFrames() >= starting + frames) {
          scene.events.off("preupdate", update);
          res(null);
        }
      };
      scene.events.on("preupdate", update);
    });
  }

  return {
    game,
    scene,
    elapsedFrames,
    waitFrames,
    pause: () => scene.scene.pause(),
    resume: () => scene.scene.resume(),
    step: async (frames: number) => {
      scene.scene.resume();
      await waitFrames(frames);
      scene.scene.pause();
    },
  };
}
