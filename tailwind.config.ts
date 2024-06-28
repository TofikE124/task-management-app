import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: {
        max: "48rem",
      },
      md: {
        min: "48rem",
        max: "60rem",
      },
      mdsm: {
        max: "60rem",
      },
      lgmd: { min: "48rem" },
      lg: {
        min: "60rem",
      },
    },
    extend: {
      colors: {
        "main-purple": "rgba(99, 95, 199, 1)",
        "main-purple-hover": "#A8A4FF",
        "main-purple-10": "rgba(99, 95, 199, 0.1)",
        "main-purple-25": "rgba(99, 95, 199, 0.25)",
        black: "#000112",
        "slate-grey": "#40414B",
        "dark-grey": "#2B2C37",
        "very-dark-grey": "#20212C",
        "medium-grey": "#828FA3",
        "medium-grey-25": "rgba(130, 143, 163, 0.25)",
        "light-grey": "#F4F7FD",
        white: "#FFF",
        "white-hover": "#E0E0E0",
        red: "#EA5555",
        "red-hover": "#FF9898",
        "lines-dark": "#3E3F4E",
        "lines-light": "#E4EBFA",
      },
      screens: {
        lg: "",
      },
    },
  },
  plugins: [
    function ({ addVariant, e }: any) {
      addVariant("group-toggled", ({ modifySelectors, separator }: any) => {
        modifySelectors(({ className }: any) => {
          return `.group.toggled .${e(
            `group-toggled${separator}${className}`
          )}`;
        });
      });
    },
  ],
  darkMode: "class",
};
export default config;
