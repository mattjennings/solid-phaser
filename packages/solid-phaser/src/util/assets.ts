import type Phaser from "phaser";

/**
 * Returns true if all assets are already cached in the loader
 */
export function assetsCached(scene: Phaser.Scene, assets: Assets): boolean {
  for (const type in assets) {
    for (const asset of assets[type]) {
      const assetKey = getAssetKey(asset);

      switch (type as keyof Assets) {
        case "aseprite":
        case "atlas":
        case "image":
        case "multiatlas":
        case "spine":
        case "spritesheet":
          if (!scene.textures.exists(assetKey)) {
            return false;
          }
          break;

        case "audio":
          if (!scene.load.cacheManager.audio.exists(assetKey)) {
            return false;
          }
          break;

        case "binary":
          if (!scene.load.cacheManager.binary.exists(assetKey)) {
            return false;
          }
          break;

        case "json":
          if (!scene.load.cacheManager.json.exists(assetKey)) {
            return false;
          }
          break;

        case "obj":
          if (!scene.load.cacheManager.obj.exists(assetKey)) {
            return false;
          }
          break;

        case "glsl":
          if (!scene.load.cacheManager.shader.exists(assetKey)) {
            return false;
          }
          break;

        case "text":
          if (!scene.load.cacheManager.text.exists(assetKey)) {
            return false;
          }
          break;

        case "tilemapCSV":
        case "tilemapTiledJSON":
          if (!scene.load.cacheManager.tilemap.exists(assetKey)) {
            return false;
          }
          break;

        case "video":
          if (!scene.load.cacheManager.video.exists(assetKey)) {
            return false;
          }
          break;

        case "xml":
          if (!scene.load.cacheManager.xml.exists(assetKey)) {
            return false;
          }
          break;
      }
    }
  }

  return true;
}

/**
 * Loads all assets into the scene
 */
export function loadAssets(scene: Phaser.Scene, assets: Assets) {
  Object.keys(assets).forEach((key) => {
    assets[key].forEach((asset) =>
      loadAssetByType(scene, key as keyof Assets, asset)
    );
  });
}

function getAssetKey(asset: string | Record<string, unknown>): string {
  if (isString(asset)) {
    return removeExtension(asset);
  }

  return asset.key as string;
}

function loadAssetByType(
  scene: Phaser.Scene,
  type: keyof Assets,
  asset: string | Record<string, unknown>
) {
  const key = getAssetKey(asset);
  switch (type) {
    // atlas assets
    case "atlas":
    case "multiatlas":
    case "spine":
      return isString(asset)
        ? scene.load[type]({
            key,
            atlasURL: asset,
          })
        : scene.load[type](asset as any);

    // simple key & url assets
    case "audio":
    case "binary":
    case "glsl":
    case "json":
    case "image":
    case "obj":
    case "pack":
    case "plugin":
    case "scenePlugin":
    case "svg":
    case "text":
    case "tilemapCSV":
    case "tilemapTiledJSON":
    case "video":
    case "xml":
      return isString(asset)
        ? // @ts-ignore - `scene.load[type]` result is "too complex" for typescript
          scene.load[type]({
            key,
            url: asset,
          })
        : scene.load[type](asset as any);

    // non-string assets
    case "aseprite":
    case "spritesheet":
      return scene.load[type](asset as any);
  }
}

function isString(asset: any): asset is string {
  return typeof asset === "string";
}

function removeExtension(asset: string) {
  return asset.substr(0, asset.lastIndexOf(".")) || asset;
}

/*********************
 *      Types        *
 *********************/

export interface Assets {
  aseprite?: AsepriteAsset[];
  atlas?: AtlasAsset[];
  audio?: AudioAsset[];
  binary?: BinaryAsset[];
  glsl?: GLSLAsset[];
  json?: JSONAsset[];
  image?: ImageAsset[];
  multiatlas?: MultiAtlasAsset[];
  obj?: ObjAsset[];
  pack?: PackAsset[];
  plugin?: PluginAsset[];
  scenePlugin?: ScenePluginAsset[];
  spine?: SpineAsset[];
  spritesheet?: SpriteSheetAsset[];
  svg?: SVGAsset[];
  text?: TextAsset[];
  tilemapCSV?: TilemapCSVAsset[];
  tilemapTiledJSON?: TilemapJSONAsset[];
  video?: VideoAsset[];
  xml?: XMLAsset[];
}

/**
 * URL to the asset. The key will be the URL without the file extension.
 */
export type StringAsset = string;

export type AsepriteAsset = Phaser.Types.Loader.FileTypes.AsepriteFileConfig;

/**
 * Path to the atlas JSON file. The atlas file must have a `meta.image` property with a
 * path to the image.
 */
export type AtlasStringAsset = string;

export type AtlasAsset =
  | AtlasStringAsset
  | Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig;

export type AudioAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.AudioFileConfig;

export type BinaryAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.BinaryFileConfig;

export type GLSLAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.GLSLFileConfig;

export type JSONAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.JSONFileConfig;

export type ImageAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.ImageFileConfig;

export type MultiAtlasAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.MultiAtlasFileConfig;

export type ObjAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.OBJFileConfig;

export type PackAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.PackFileConfig;

export type PluginAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.PluginFileConfig;

export type ScenePluginAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.ScenePluginFileConfig;

export type SpineAsset =
  | StringAsset
  | {
      /**
       * The absolute or relative URL to load the JSON file from.
       */
      jsonURL?: string;

      /**
       * The absolute or relative URL to load the texture atlas data file from.
       */
      atlasURL?: string;

      /**
       * Do the textures contain pre-multiplied alpha or not?
       */
      preMultipliedAlpha?: boolean;

      /**
       * An XHR Settings configuration object for the json file. Used in replacement of the Loaders default XHR Settings.
       */
      jsonXhrSettings?: Phaser.Types.Loader.XHRSettingsObject;

      /**
 *
An XHR Settings configuration object for the atlas data file. Used in replacement of the Loaders default XHR Settings.
 */
      atlasXhrSettings?: Phaser.Types.Loader.XHRSettingsObject;
    };

export type SpriteSheetAsset =
  Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig;

export type SVGAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.SVGFileConfig;

export type TextAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.TextFileConfig;

export type TilemapCSVAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.TilemapCSVFileConfig;

export type TilemapJSONAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.TilemapJSONFileConfig;

export type VideoAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.VideoFileConfig;

export type XMLAsset =
  | StringAsset
  | Phaser.Types.Loader.FileTypes.XMLFileConfig;
