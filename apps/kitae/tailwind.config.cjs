const plugin = require("tailwindcss/plugin");

// From https://github.com/tailwindlabs/tailwindcss/blob/0bdd19aae0dbf5316fcb33eaa8be6e0b6eafacc6/src/util/flattenColorPalette.js
const flattenColorPalette = (colors) =>
  Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == "object"
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === "DEFAULT" ? "" : `-${number}`)]: hex,
          }))
        : [{ [`${color}`]: values }]
    )
  );

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      dp: {
        0: "#18131C",
        1: "#241F28",
        2: "#28242C",
        3: "#2A262E",
        4: "#2D2830",
        6: "#312D35",
        8: "#343038",
        12: "#39343C",
        16: "#3A363E",
        24: "#3D3940",
      },
      primary: {
        100: "#2CC98F",
        200: "#28B883",
        300: "#25A777",
        400: "#21976B",
        500: "#1D8660",
        600: "#1A7554",
        700: "#166448",
        800: "#12543C",
        900: "#0F4330",
      },
      secondary: {
        100: "#2C9AC9",
        200: "#288DB8",
        300: "#2580A7",
        400: "#217397",
        500: "#1D6686",
        600: "#1A5A75",
        700: "#164D64",
        800: "#124054",
        900: "#0F3343",
      },
      error: {
        100: "#FBB7B1",
        200: "#FAA59E",
        300: "#F9938A",
        400: "#F98177",
        500: "#F76C5E",
        600: "#F75E50",
        700: "#F64C3C",
        800: "#F53A29",
        900: "#F42815",
      },
      current: "currentColor",
      transparent: "transparent",
      white: {
        DEFAULT: "#E6E6E6",
        real: "#FFFFFF",
      },
      // "kitae-start": "#1D8660",
      // "kitae-end": "#1D6686",
      // "kitae-container": "#131313",
      // "kitae-separator": "#454545",
      // "kitae-text": "#E6E6E6",
      // "kitae-text-inverse": "#2A2A2A",
      // "kitae-panel-bg": "#2B2B2B",
      // "kitae-panel": "#292929",
      // "kitae-icon": "#787878",
    },
    extend: {},
  },
  plugins: [
    // Plugin to add the CSS stop-color (svg) available in tailwindcss.
    plugin(function ({ theme, matchUtilities }) {
      matchUtilities(
        {
          "stop-color": (value) => ({
            "stop-color": value,
          }),
        },
        { values: flattenColorPalette(theme("colors")) }
      );
    }),
    // From https://gist.github.com/Merott/d2a19b32db07565e94f10d13d11a8574
    plugin(function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = "") {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];
          const cssVariable =
            colorKey === "DEFAULT"
              ? `--color${colorGroup}`
              : `--color${colorGroup}-${colorKey}`;

          const newVars =
            typeof value === "string"
              ? { [cssVariable]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    }),
  ],
};
