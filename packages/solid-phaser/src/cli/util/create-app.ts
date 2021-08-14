import fs from "fs-extra";
import path from "path";
import mkdirp from "mkdirp";
import { ManifestData } from "./types";

const previous_contents = new Map<string, string>();
let isInitial = true;

export function writeIfChanged(file: string, code: string) {
  if (code !== previous_contents.get(file)) {
    previous_contents.set(file, code);
    mkdirp.sync(path.dirname(file));
    fs.writeFileSync(file, code);
  }
}

export function createApp({
  manifestData,
  dir,
}: {
  manifestData: ManifestData;
  dir: string;
}) {
  writeIfChanged(
    `${dir}/manifest.js`,
    generateClientManifest(manifestData, dir)
  );

  writeIfChanged(`${dir}/root.js`, generateApp(manifestData, dir));

  if (isInitial) {
    fs.writeFileSync(
      path.resolve(`${dir}/index.jsx`),
      `import * as manifest from "./manifest.js";
      import { render } from "solid-js/web";
      import { Router } from 'solid-phaser/router'
      
      const Game = manifest.game.component;
      
      render(() => (
          <Game>
            <Router initial={manifest.initialScene} scenes={manifest.scenes} />
          </Game>
        ),
        document.getElementById("#root")
      )  
`
    );

    isInitial = false;
  }
}

function generateClientManifest(manifestData: ManifestData, dir: string) {
  const scenes = `{
    ${Object.entries(manifestData.scenes)
      .sort(([_, a]) => (a.initial ? -1 : 1))
      .map(([_, scene]) => {
        return `${JSON.stringify(scene.path)}: {
          path: "${scene.path}",
          component: () => import(${JSON.stringify(
            path.relative(dir, scene.component)
          )}),        
          initial: ${JSON.stringify(scene.initial)}
        }`;
      })
      .join(",")}
  }`;

  const templates = `{
    ${Object.entries(manifestData.templates)
      .map(([_, template]) => {
        const componentPath = template.component.startsWith(
          "./runtime/templates"
        )
          ? template.component
          : path.relative(dir, template.component);

        return `${JSON.stringify(template.path)}: {
          path: "${template.path}",
          component: () => import(${JSON.stringify(componentPath)})
        }`;
      })
      .join(",")}
  }`;

  return `
		import Game from ${JSON.stringify(
      path.relative(dir, manifestData.game.component)
    )};

		export const scenes = ${scenes};
    
    export const templates = ${templates};

    export const game = {
      component: Game
    }
	`;
}

function generateApp(manifestData: ManifestData, base: string) {
  return `
		export default () => {
      console.log('app')
      return null
    }
	`;
  // return `
  // 	<script>
  //     import { Scene } from 'phelte';

  //     export let Game;
  //     export let loadingComponent = undefined
  //     export let component = undefined;
  //     export let gameProps = undefined;
  //     export let sceneProps = undefined;
  //     export let componentProps = {}

  //     $: sceneKey = sceneProps?.key
  // 	</script>

  // 	<Game {...(gameProps || {})}>
  //     {#if component}
  //       {#key sceneKey}
  //         <Scene {...(sceneProps || {})}>
  //           <slot slot="loading" let:progress>
  //             <svelte:component this={loadingComponent} {...componentProps}  progress={progress}  />
  //           </slot>
  //           <svelte:component this={component} {...componentProps} />
  //         </Scene>
  //       {/key}
  //     {/if}
  // 	</Game>
  // `;
}
