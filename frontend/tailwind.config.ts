import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 13 Curated Palettes for UniEnrich AI
        black: {
          900: "#161616",
          800: "#232323",
          700: "#2c2c2c",
          600: "#363636",
        },
        white: {
          50: "#ffffff",
          100: "#faf9f7",
          200: "#f6f6f6",
          300: "#f5f4f2",
          400: "#f2f1ef",
        },
        red: {
          500: "#a52020",
          600: "#8e0300",
          700: "#76150c",
          800: "#5a0e07",
        },
        blue: {
          400: "#347aea",
          500: "#1c47c6",
          600: "#1e4ba3",
          800: "#041162",
        },
        green: {
          300: "#beddb0",
          500: "#7aa95d",
          700: "#395b39",
          900: "#273f27",
        },
        purple: {
          300: "#b084f7",
          500: "#8347ed",
          600: "#6b31d9",
          800: "#582dca",
        },
        orange: {
          400: "#ec8e39",
          500: "#e37830",
          600: "#cd5f29",
          700: "#b13f21",
        },
        pink: {
          200: "#f6cae5",
          300: "#f1abd6",
          500: "#e978c2",
          600: "#da3473",
        },
        lightblue: {
          200: "#cedaee",
          300: "#b5cee5",
          400: "#9eb8d2",
          600: "#6d8cbe",
        },
        lime: {
          200: "#c3cda0",
          300: "#b2c176",
          500: "#89994c",
          700: "#5c642a",
        },
        brown: {
          200: "#c4af93",
          400: "#83664b",
          600: "#5c4134",
          800: "#301e14",
        },
        grey: {
          200: "#d4d5d9",
          300: "#b3b5ba",
          400: "#94969b",
          600: "#6b6e71",
        },
        yellow: {
          300: "#f5e06d",
          400: "#f0cf47",
          500: "#eabe41",
          600: "#e5b23e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
