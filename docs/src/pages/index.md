---
title: Intro
layout: ../layouts/Main.astro
---

# Introduction

solid-phaser allows you to create Phaser games with the Solid framework.

This is still in the very early stages. The current focus is to experiment with the core API of creating game objects, interacting with them, etc. before going for full Phaser API coverage. Expect breaking changes without warning while it's still in 0.x.x.

The [GameObject](/components/game-object) component is designed to be extensible, so for any missing components based on GameObject you should be able to create your own for the time being.

# Getting Started

The example template is the easiest way to get started. It uses our custom build tool (using vite) to help manage scenes and other configuration. There will be docs on this soon.

```jsx codesandbox=solid-phaser
import Phaser from 'phaser'
import { Game, Scene, Text } from 'solid-phaser'

export default function Main() {
  return (
    <Text
      x={400}
      y={400}
      text="Hello World"
      origin={{ x: 0.5, y: 0.5 }}
      style={{
        fontSize: '48px',
      }}
    />
  )
}
```
