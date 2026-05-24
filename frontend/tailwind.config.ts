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
        bg: {
          primary: "#F3F2EF",
          surface: "#FFFFFF",
        },
        accent: {
          main: "#0A66C2",
          dark: "#004182",
          light: "#EBF3FB",
        },
        text: {
          primary: "#000000",
          muted: "#666666",
        },
        border: {
          DEFAULT: "#E0DDD8",
        },
        success: "#057642",
        warning: "#B24020",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
