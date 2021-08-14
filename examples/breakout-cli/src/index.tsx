import { render } from "solid-js/web";
import { Game, Scene } from "solid-phaser";
import Breakout from "./Breakout";
import "./index.css";

render(
  () => (
    <Game
      width={800}
      height={800}
      physics={{
        default: "arcade",
      }}
      scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
    >
      <Scene
        key="main"
        assets={{
          atlas: ["breakout.json"],
        }}
        create={(scene) => {
          scene.physics.world.setBoundsCollision(true, true, true, true);
          scene.anims.createFromAseprite("assets/sprites/player");
        }}
      >
        <Breakout />
      </Scene>
    </Game>
  ),
  document.getElementById("root")
);
