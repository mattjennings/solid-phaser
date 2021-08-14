import del from "del";
import path from "path";
import vite from "vite";
import { getConfig } from "../config";
import { createApp } from "../util/create-app";
import createManifestData from "../util/create-manifest-data";

export default async function build({ cwd = process.cwd() } = {}) {
  const dir = path.resolve(cwd, ".phelte");
  const outDir = path.resolve(cwd, "dist");

  await del([dir, outDir]);

  const config = await getConfig({ production: true });

  const manifestData = await createManifestData({ cwd, config });
  createApp({
    manifestData,
    dir,
  });
  await vite.build(config.vite);
}
