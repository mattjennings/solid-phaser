---
layout: ../../layouts/Components.astro
title: GameObject
component: /game-objects/GameObject.tsx
---

```jsx codesandbox=solid-phaser
import Phaser from 'phaser'
import { Game, Scene, GameObject } from 'solid-phaser'

export default function App() {
  return (
    <GameObject
      // create the game object. doesn't matter how you create it, it just needs to return a game object
      create={(scene) => scene.add.text()}
      // any additional props will be assigned to the game object
      x={400}
      y={400}
      text="Hello World"
      origin={{ x: 0.5, y: 0.5 }}
      style={{
        fontSize: '48px',
      }}
      // style prop needs to be assigned through instance.setStyle
      applyProps={{
        style: (instance, value) => instance.setStyle(value),
      }}
    />
  )
}
```
