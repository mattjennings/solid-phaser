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

  renderers: ["@astrojs/renderer-solid"],
};
