import Phaser from "phaser";
import { Game, Scene, Text } from "solid-phaser";

export default function App() {
  return (
    <Game
      width={800}
      height={800}
      scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
    >
      <Scene key="main">
        <Text
          x={400}
          y={400}
          text="hello world"
          origin={{ x: 0.5, y: 0.5 }}
          style={{
            fontSize: "48px"
          }}
        />
      </Scene>
    </Game>
  );
}