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
          customTemplates: {
            "solid-phaser": {
              extends: "file:../templates/typescript",
              entry: "src/App.tsx",
              query: { codemirror: 1 },
            },
          },
        },
      ],
    ],
  },

  renderers: ["@astrojs/renderer-solid"],
};
