const site = process.env.SITE;

export default {
  buildOptions: site
    ? {
        site,
        sitemap: true,
      }
    : {},
  devOptions: {
    port: 4000,
    tailwindConfig: "./tailwind.config.js",
  },

  markdownOptions: {
    remarkPlugins: [
      [
        import("remark-codesandbox"),
        {
          mode: "iframe",
          autoDeploy: process.env.NODE_ENV === "production",
          customTemplates: {
            "solid-phaser": {
              extends: "file:../templates/typescript",
              entry: "src/App.tsx",
              query: {
                codemirror: 1,
                hidenavigation: 1,
                runonclick: 1,
              },
            },
            "solid-phaser|preview": {
              extends: "solid-phaser",
              query: {
                codemirror: 1,
                hidenavigation: 1,
                runonclick: 1,
                view: "preview",
              },
            },
          },
        },
      ],
    ],
  },

  renderers: ["@astrojs/renderer-solid"],
};
