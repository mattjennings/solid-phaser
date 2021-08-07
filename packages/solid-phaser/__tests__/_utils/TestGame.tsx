import { JSX } from "solid-js";
import Game from "../../src/Game";
import Scene from "../../src/Scene";
import { Ref } from "../../src/types";

export default function TestGame(props: {
  ref?: Ref<Phaser.Game>;
  children: JSX.Element;
}) {
  return (
    <Game ref={props.ref} banner={false} type={Phaser.HEADLESS}>
      <Scene key="main">{props.children}</Scene>
    </Game>
  );
}
