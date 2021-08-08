export default {
  // projectRoot: "../",
  buildOptions: {
    // site: 'http://example.com',           // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
    // sitemap: true,       // Generate sitemap (set to "false" to disable)
  },
  devOptions: {
    port: 4000,
    tailwindConfig: "./tailwind.config.js",
  },

  renderers: ["@astrojs/renderer-solid"],
};
