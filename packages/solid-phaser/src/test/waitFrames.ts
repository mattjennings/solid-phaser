export interface WaitFramesConfig {
  timeout?: number;
}
export async function waitFrames(
  game: Phaser.Game,
  frames: number,
  config: WaitFramesConfig = {}
) {
  return new Promise((res, rej) => {
    const { timeout = 10000 } = config;

    const _timeout = setTimeout(() => {
      game.events.off("prestep", update);
      rej(`waitFrames timeout after ${timeout}ms`);
    }, timeout);

    let count = 0;
    const update = () => {
      if (count < frames) {
        count += 1;
      } else {
        game.events.off("prestep", update);
        clearTimeout(_timeout);
        res(null);
      }
    };

    game.events.on("prestep", update);
  });
}
