import { render, waitFor } from "solid-testing-library";
import { createSignal } from "solid-js";
import Game from "../src/Game";
import { GameObject, Scene } from "../src";
import { waitForValue } from "./_utils/waitForValue";

it("test", async () => {
  let ref;

  function Test() {
    return (
      <Game banner={false} type={Phaser.HEADLESS}>
        <Scene key="main">
          <GameObject
            ref={ref}
            create={(scene) => scene.add.text(0, 0, "123")}
          />
        </Scene>
      </Game>
    );
  }

  render(() => <Test />);

  await waitForValue(() => ref);

  console.log(ref);
});
