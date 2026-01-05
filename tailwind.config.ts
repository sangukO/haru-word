import type { Config } from "tailwindcss";

const config: Config = {
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
      // 애니메이션 키프레임 정의
      keyframes: {
        fontWave: {
          "0%, 100%": {
            fontWeight: "100",
            fontVariationSettings: '"wght" 100',
          },
          "50%": {
            fontWeight: "900",
            fontVariationSettings: '"wght" 900',
          },
        },
      },
      // 애니메이션 유틸리티 정의
      animation: {
        "font-wave": "fontWave 3s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
