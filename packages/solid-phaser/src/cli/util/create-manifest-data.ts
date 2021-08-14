import fs from "fs";
import path from "path";
import { SolidPhaserConfig } from "../config";
import {
  ManifestData,
  SceneComponentData,
  TemplateComponentData,
} from "./types";

export default async function createManifestData({
  cwd,
  config,
}: {
  config: SolidPhaserConfig;
  cwd: string;
}): Promise<ManifestData> {
  const sceneDir = path.resolve(cwd, config.files.scenes);
  const files = getFiles(sceneDir);

  const templates: Record<string, TemplateComponentData> = files.reduce(
    (acc, filePath) => {
      const baseName = filePath.split("/").pop();
      const component = posixify(path.relative(cwd, filePath));
      const route = filePath.replace(`${sceneDir}/`, "");

      if (baseName.startsWith("$")) {
        return {
          ...acc,
          [route]: {
            path: route,
            component,
          },
        };
      }

      return acc;
    },
    {}
  );

  const scenes: Record<string, SceneComponentData> = files.reduce(
    (acc, filePath) => {
      const baseName = filePath.split("/").pop();
      const component = posixify(path.relative(cwd, filePath));
      let route = posixify(filePath.replace(`${sceneDir}/`, ""));

      if (route.endsWith("/index")) {
        route = route.split(/\/index$/)[0];
      }

      if (!baseName.startsWith("_") && !baseName.startsWith("$")) {
        return {
          ...acc,
          [route]: {
            path: route,
            component,
            initial: config.initialScene && config.initialScene === route,
          },
        };
      }

      return acc;
    },
    {}
  );

  return {
    game: {
      component: path.relative(cwd, config.files.game),
    },
    scenes,
    templates,
  };
}

function getFiles(dir: string): string[] {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });

  return files.flat();
}

function posixify(str: string) {
  return str.replace(/\\/g, "/");
}
