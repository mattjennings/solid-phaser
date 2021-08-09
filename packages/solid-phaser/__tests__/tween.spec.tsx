import { render, waitFor } from "solid-testing-library";
import { createTween } from "../src/tween";
import GameObject from "../src/game-objects/GameObject";
import TestGame from "./_utils/TestGame";
import { createEffect } from "solid-js";

it("creates a tween and animates the property", async () => {
  let obj: Phaser.GameObjects.Text;

  let vals = [];
  function Component() {
    const [val, setVal] = createTween(1, {
      ease: "Linear",
      duration: 1000,
      onUpdate(_, latest) {
        vals.push(latest);
      },
    });

    setVal(2);

    createEffect(() => {
      // console.log(val());
    });
    return (
      <GameObject
        ref={obj}
        create={(scene) => scene.add.text(0, 0, "123")}
        props={{
          text: "hello",
          x: val(),
        }}
      />
    );
  }

  render(() => (
    <TestGame>
      <Component />
    </TestGame>
  ));

  await waitFor(() => expect(obj.x).toEqual(2), {
    timeout: 5000,
  });
  console.log(vals);
});
