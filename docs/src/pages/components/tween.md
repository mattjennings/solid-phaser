---
layout: ../../layouts/Components.astro
title: Tween
component: /animation/Tween.tsx
---

```jsx codesandbox=solid-phaser
import Phaser from 'phaser'
import { Show, createSignal } from 'solid-js'
import { Game, Scene, Text, Tween } from 'solid-phaser'

export default function App() {
  const [count, setCount] = createSignal(0)
  const [text, setText] = createSignal('click me 3 times (0)')

  return (
    <Show when={count() < 3}>
      <Text
        x={400}
        y={400}
        text={text()}
        interactive
        origin={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: '32px',
        }}
        onPointerUp={(self) => {
          // delay count update so we can update text prop before Show unmounts
          const nextCount = count() + 1
          setTimeout(() => setCount(nextCount))

          setText(
            nextCount >= 3 ? 'goodbye' : `click me 3 times (${nextCount})`
          )
        }}
      >
        <Tween
          ease="Bounce"
          duration={300}
          initial={{ alpha: 0, scale: 0 }}
          animate={{ alpha: 1, scale: 1 }}
          whileTap={{
            alpha: 1,
            scale: 2,
          }}
          exit={{
            alpha: 0,
            scale: 0,
            transition: {
              delay: 1000,
              ease: 'Linear',
            },
          }}
        />
      </Text>
    </Show>
  )
}
```
