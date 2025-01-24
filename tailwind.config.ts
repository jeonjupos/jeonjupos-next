import type { Config } from "tailwindcss";

const config: {
  content: string[];
  theme: {
    extend: {
      backgroundImage: { "gradient-radial": string; "gradient-conic": string };
      colors: { main: string; btn_bg_1: string }
    };
    screens: { tablet: { max: string }; laptop: { max: string }; desktop: { max: string } }
  };
  plugins: any[]
} = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        main: '#0B0B3B',
        btn_bg_1: '#0489B1',
      }
    },
    screens: {
      'tablet': { max: '640px' },
      // => @media (min-width: 640px) { ... }

      'laptop': { max: '1024px' },
      // => @media (min-width: 1024px) { ... }

      'desktop': { max: '1280px' },
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
};
export default config;
