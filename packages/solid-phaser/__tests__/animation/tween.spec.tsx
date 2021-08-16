import { onMount } from 'solid-js'
import { GameObject } from '../../src/game-objects/GameObject'
import { render, waitFor } from '../../src/test'
import { createTween } from '../../src/animation'

it('animates a number', async () => {
  let obj: Phaser.GameObjects.Text

  function Component() {
    const [val, setVal] = createTween(0, {
      ease: (v) => v,
      duration: 1000,
    })

    setVal(1)

    return (
      <GameObject
        ref={obj}
        create={(scene) => scene.add.text(0, 0, '123')}
        x={val()}
      />
    )
  }

  await render(() => <Component />)

  await waitFor(
    () => {
      expect(obj.x).toEqual(1)
    },
    { timeout: 5000 }
  )
})

it('animates an object', async () => {
  let obj: Phaser.GameObjects.Text

  function Component() {
    const [val, setVal] = createTween(
      { x: 0, y: 0 },
      {
        ease: (v) => v,
        duration: 1000,
      }
    )

    setVal({ x: 1, y: 2 })

    return (
      <GameObject
        ref={obj}
        create={(scene) => scene.add.text(0, 0, '123')}
        x={val().x}
        y={val().y}
      />
    )
  }

  await render(() => <Component />)

  await waitFor(
    () => {
      expect(obj.x).toEqual(1)
      expect(obj.y).toEqual(2)
    },
    { timeout: 5000 }
  )
})

it('animates a ref', async () => {
  let obj: Phaser.GameObjects.Text

  function Component() {
    const [, setVal] = createTween(() => obj, {
      ease: (v) => v,
      duration: 1000,
    })

    onMount(() => {
      setVal({ x: 1 })
    })

    return (
      <GameObject
        ref={obj}
        create={(scene) => scene.add.text(0, 0, '123')}
        x={0}
      />
    )
  }

  await render(() => <Component />)

  await waitFor(
    () => {
      expect(obj.x).toEqual(1)
    },
    { timeout: 5000 }
  )
})

it('animates an array of refs', async () => {
  let obj: Phaser.GameObjects.Text
  let obj2: Phaser.GameObjects.Text

  function Component() {
    const [, setVal] = createTween(() => [obj, obj2], {
      ease: (v) => v,
      duration: 1000,
    })

    onMount(() => {
      setVal({ x: 1 })
    })

    return (
      <>
        <GameObject
          ref={obj}
          create={(scene) => scene.add.text(0, 0, '123')}
          x={0}
        />
        <GameObject
          ref={obj2}
          create={(scene) => scene.add.text(0, 0, '123')}
          x={0}
        />
      </>
    )
  }

  await render(() => <Component />)

  await waitFor(
    () => {
      expect(obj.x).toEqual(1)
      expect(obj2.x).toEqual(1)
    },
    { timeout: 5000 }
  )
})
