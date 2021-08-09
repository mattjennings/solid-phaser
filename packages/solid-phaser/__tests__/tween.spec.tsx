import { render, waitFor } from "solid-testing-library";
import { createTween } from "../src/tween";
import GameObject from "../src/game-objects/GameObject";
import TestGame from "./_utils/TestGame";
import { createEffect } from "solid-js";

it("creates a tween and animates the property", async () => {
  let obj: Phaser.GameObjects.Text;

  let vals = [];
  function Component() {
    const [val, setVal] = createTween(0, {
      ease: (v) => v,
      duration: 1000,
      onUpdate(_, latest) {
        vals.push(latest);
      },
    });

    setVal(1);

    return (
      <GameObject
        ref={obj}
        create={(scene) => scene.add.text(0, 0, "123")}
        x={val()}
      />
    );
  }

  render(() => (
    <TestGame>
      <Component />
    </TestGame>
  ));

  await waitFor(() => expect(obj.x).toEqual(1), {
    timeout: 5000,
  });
  expect(vals.length).toEqual(61);

  console.log(vals[0], vals[1], vals[2]);
  console.log(Phaser.Math.Easing.Linear(0.5));
  // vals.forEach((val, i) => {
  //   expect(val).toEqual()
  // })
});
