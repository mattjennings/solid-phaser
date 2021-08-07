import { render, waitFor } from "solid-testing-library";
import { GameObject } from "../src";
import TestGame from "./_utils/TestGame";

it("creates a game object", async () => {
  let obj: Phaser.GameObjects.Text;
  let game: Phaser.Game;

  function Test() {
    return (
      <TestGame ref={game}>
        <GameObject
          ref={obj}
          create={(scene) => scene.add.text(0, 0, "123")}
          props={{
            text: "hello",
          }}
        />
      </TestGame>
    );
  }

  render(() => <Test />);

  await waitFor(() =>
    expect(game.scene.scenes[0].children.exists(obj)).toEqual(true)
  );
});

it("assigns props", async () => {
  let ref: Phaser.GameObjects.Text;

  function Test() {
    return (
      <TestGame>
        <GameObject
          ref={ref}
          create={(scene) => scene.add.text(0, 0, "123")}
          props={{
            text: "hello",
          }}
        />
      </TestGame>
    );
  }

  render(() => <Test />);

  await waitFor(() => expect(ref.text).toEqual("hello"));
});

it("assigns props via applyProps", async () => {
  let ref: Phaser.GameObjects.Text;

  function Test() {
    return (
      <TestGame>
        <GameObject
          ref={ref}
          create={(scene) => scene.add.text(0, 0, "123")}
          props={{
            style: {
              color: "white",
            },
          }}
          applyProps={{
            style: (instance, value) => instance.setStyle(value),
          }}
        />
      </TestGame>
    );
  }

  render(() => <Test />);

  await waitFor(() => expect(ref.style.color).toEqual("white"));
});

it("fires onPreUpdate, onUpdate, onPostUpdate in order", async () => {
  let ref: Phaser.GameObjects.Text;

  let numbers = [];
  const addNum = (v) => {
    if (numbers.length < 3) {
      numbers.push(v);
    }
  };

  function Test() {
    return (
      <TestGame>
        <GameObject
          ref={ref}
          create={(scene) => scene.add.text(0, 0, "123")}
          onPreUpdate={() => addNum(1)}
          onUpdate={() => addNum(2)}
          onPostUpdate={() => addNum(3)}
        />
      </TestGame>
    );
  }

  render(() => <Test />);

  await waitFor(() => {
    expect(numbers).toEqual([1, 2, 3]);
  });
});
