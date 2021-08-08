const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  darkMode: "class",
  purge: ["./public/**/*.html", "./src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}"],
  theme: {
    extend: {
      colors: {
        "light-blue": colors.lightBlue,
        cyan: colors.cyan,
      },
      typography: (theme) => {
        return {
          DEFAULT: {
            css: {
              code: {
                borderRadius: theme("borderRadius.md"),
                paddingTop: theme("spacing.1"),
                paddingBottom: theme("spacing.1"),
                paddingLeft: theme("spacing.1"),
                paddingRight: theme("spacing.1"),
                backgroundColor: theme("colors.gray.800"),
                fontFamily: "inherit !important",
                fontWeight: "500 !important",
                whiteSpace: "nowrap",
                color: theme("colors.gray.900"),
                backgroundColor: theme("colors.gray.300"),
              },
              "code::before": {
                content: '""',
              },
              "code::after": {
                content: '""',
              },
              hr: {
                borderColor: theme("colors.gray.300"),
              },
              ul: {
                marginTop: "0 !important",
                marginBottom: "0 !important",
              },
              li: {
                marginTop: "0 !important",
                marginBottom: "0 !important",
              },
              img: {
                marginLeft: "auto",
                marginRight: "auto",
              },
              "h1,h2,h3,h4,h5,h6": {
                a: {
                  color: "inherit",
                  fontWeight: "inherit",
                  textDecoration: "none",
                },
              },
            },
          },
          sm: {
            css: {
              "pre code": {
                fontSize: theme("fontSize.sm")[0],
              },
              h1: {
                fontSize: theme("fontSize.xl"),
              },
              h2: {
                fontSize: theme("fontSize.lg"),
              },
              h3: {
                fontSize: theme("fontSize.base"),
              },
              h4: {
                fontSize: theme("fontSize.base"),
              },
            },
          },
          lg: {
            css: {
              "pre code": {
                fontSize: theme("fontSize.base")[0],
              },
              code: {
                paddingLeft: theme("spacing.2"),
                paddingRight: theme("spacing.2"),
              },
              h1: {
                fontSize: theme("fontSize.3xl"),
              },
              h2: {
                fontSize: theme("fontSize.2xl"),
              },
              h3: {
                fontSize: theme("fontSize.xl"),
              },
              h4: {
                fontSize: theme("fontSize.lg"),
              },
            },
          },
        };
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
