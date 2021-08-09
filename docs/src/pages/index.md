---
title: Intro
layout: ../layouts/Main.astro
---

# Introduction

This is still an early proof of concept and is not yet ready for production use. If you still wish to use it, this is how you can get started:

```
npm install solid-phaser
```

```jsx
import { render } from "solid-js/web";
import { Game, Scene, Text } from "solid-phaser";

const App = () => (
  <Game
    width={800}
    height={800}
    scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
  >
    <Scene key="main">
      <Text x={300} y={400} text="Hello World" />
    </Scene>
  </Game>
);

render(() => <App />, document.getElementById("root"));
```

The component APIs are generated from the source code, so they will be updated as I go. Breaking changes will happen!
