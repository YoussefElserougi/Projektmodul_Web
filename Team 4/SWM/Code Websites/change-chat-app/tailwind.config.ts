import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SWM Farben (optional anpassbar)
        swm: {
          blue: "#0066cc",
          darkblue: "#004080",
        },
      },
    },
  },
  plugins: [],
};

export default config;
