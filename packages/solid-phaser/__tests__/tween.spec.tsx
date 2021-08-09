import { onMount } from "solid-js";
import GameObject from "../src/game-objects/GameObject";
import { render } from "../src/test";
import { createTween } from "../src/tween";

it("animates a primitive", async () => {
  let obj: Phaser.GameObjects.Text;

  function Component() {
    const [val, setVal] = createTween(0, {
      ease: (v) => v,
      duration: 1000,
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

  const { step } = await render(() => <Component />, {
    paused: true,
  });

  await step(30);
  expect(Math.round(obj.x * 10) / 10).toEqual(0.5);
  await step(32); // not sure why it takes 62 frames total
  expect(obj.x).toEqual(1);
});

it("animates a ref", async () => {
  let obj: Phaser.GameObjects.Text;

  function Component() {
    const [, setVal] = createTween(() => obj, {
      ease: (v) => v,
      duration: 1000,
    });

    onMount(() => {
      setVal({ x: 1 });
    });

    return (
      <GameObject
        ref={obj}
        create={(scene) => scene.add.text(0, 0, "123")}
        x={0}
      />
    );
  }

  const { step } = await render(() => <Component />, {
    paused: true,
  });

  await step(30);
  expect(Math.round(obj.x * 10) / 10).toEqual(0.5);
  await step(33);
  expect(obj.x).toEqual(1);
});

it("animates an array of refs", async () => {
  let obj: Phaser.GameObjects.Text;
  let obj2: Phaser.GameObjects.Text;

  function Component() {
    const [, setVal] = createTween(() => [obj, obj2], {
      ease: (v) => v,
      duration: 1000,
    });

    onMount(() => {
      setVal({ x: 1 });
    });

    return (
      <>
        <GameObject
          ref={obj}
          create={(scene) => scene.add.text(0, 0, "123")}
          x={0}
        />
        <GameObject
          ref={obj2}
          create={(scene) => scene.add.text(0, 0, "123")}
          x={0}
        />
      </>
    );
  }

  const { step } = await render(() => <Component />, {
    paused: true,
  });

  await step(30);
  expect(Math.round(obj.x * 10) / 10).toEqual(0.5);
  expect(Math.round(obj2.x * 10) / 10).toEqual(0.5);
  await step(33);
  expect(obj.x).toEqual(1);
  expect(obj2.x).toEqual(1);
});
