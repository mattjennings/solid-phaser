import { createSignal } from 'solid-js'
import { render, waitFor } from '../../src/test'
import { GameObject } from '../../src/game-objects/GameObject'

it('creates a game object', async () => {
  let obj: Phaser.GameObjects.Text

  function Test() {
    return (
      <GameObject ref={obj} create={(scene) => scene.add.text(0, 0, '123')} />
    )
  }

  const { game } = await render(() => <Test />)

  await waitFor(() =>
    expect(game.scene.scenes[0].children.exists(obj)).toEqual(true)
  )
})

it('assigns props', async () => {
  let ref: Phaser.GameObjects.Text

  function Test() {
    return (
      <GameObject
        ref={ref}
        create={(scene) => scene.add.text(0, 0, '123')}
        text="hello"
      />
    )
  }

  await render(() => <Test />)

  await waitFor(() => expect(ref.text).toEqual('hello'))
})

it('updates props', async () => {
  let ref: Phaser.GameObjects.Text

  function Test() {
    const [text, setText] = createSignal('hello')

    setTimeout(() => setText('world'), 50)

    return (
      <GameObject
        ref={ref}
        create={(scene) => scene.add.text(0, 0, '123')}
        text={text()}
      />
    )
  }

  await render(() => <Test />)

  await waitFor(() => expect(ref.text).toEqual('world'))
})

it('assigns props via applyProps', async () => {
  let ref: Phaser.GameObjects.Text

  function Test() {
    return (
      <GameObject
        ref={ref}
        create={(scene) => scene.add.text(0, 0, '123')}
        style={{
          color: 'white',
        }}
        applyProps={{
          style: (instance, value) => instance.setStyle(value),
        }}
      />
    )
  }

  await render(() => <Test />)

  await waitFor(() => expect(ref.style.color).toEqual('white'))
})

it('fires onPreUpdate, onUpdate, onPostUpdate in order', async () => {
  let ref: Phaser.GameObjects.Text

  const numbers = []
  const addNum = (v) => {
    if (numbers.length < 3) {
      numbers.push(v)
    }
  }

  function Test() {
    return (
      <GameObject
        ref={ref}
        create={(scene) => scene.add.text(0, 0, '123')}
        onPreUpdate={() => addNum(1)}
        onUpdate={() => addNum(2)}
        onPostUpdate={() => addNum(3)}
      />
    )
  }

  await render(() => <Test />)

  await waitFor(() => {
    expect(numbers).toEqual([1, 2, 3])
  })
})
