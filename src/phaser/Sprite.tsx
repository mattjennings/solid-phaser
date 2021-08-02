import GameObject, {
  GameObjectProps,
  AlphaProps,
  AnimationProps,
  BlendModeProps,
  ComputedSizeProps,
  DepthProps,
  FlipProps,
  MaskProps,
  OriginProps,
  PipelineProps,
  ScrollFactorProps,
  TintProps,
  TransformProps,
  VisibleProps,
} from "./GameObject";

export interface SpriteProps
  extends GameObjectProps<Phaser.GameObjects.Sprite>,
    AlphaProps,
    AnimationProps,
    BlendModeProps,
    ComputedSizeProps,
    DepthProps,
    FlipProps,
    MaskProps,
    OriginProps,
    PipelineProps,
    ScrollFactorProps,
    TintProps,
    TransformProps,
    VisibleProps {
  play?: string;
  texture?: string;
  x?: number;
  y?: number;
  frame?: number;
}

export default function Sprite(props: SpriteProps) {
  return (
    <GameObject
      ref={props.ref}
      create={(scene) =>
        scene.add.sprite(props.x, props.y, props.texture, props.frame)
      }
      props={props}
      applyProps={{
        play: (instance, val) => instance.play(val),
        frame: (instance, val) => instance.setFrame(val),
        texture: (instance, val, props) =>
          instance.setTexture(val, props.frame),
      }}
      {...props}
    >
      {props.children}
    </GameObject>
  );
}
