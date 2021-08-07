import type Phaser from "phaser";

export function getGameObjectsByName<T extends Phaser.GameObjects.GameObject>(
  scene: Phaser.Scene,
  name: string
): T[] {
  return scene.children.list.filter((child) => child.name === name) as T[];
}
