import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F0F0F0",
        foreground: "#121212",
        bauhaus: {
          red: "#D02020",
          blue: "#1040C0",
          yellow: "#F0C020",
          muted: "#E0E0E0",
          black: "#121212",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        "hard-sm": "3px 3px 0px #121212",
        "hard": "4px 4px 0px #121212",
        "hard-md": "6px 6px 0px #121212",
        "hard-lg": "8px 8px 0px #121212",
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};

export default config;
