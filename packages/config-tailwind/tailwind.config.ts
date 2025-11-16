import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Omit<Config, "content"> = {
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          50: "#FDDFDF",
          100: "#FABDBD",
          200: "#F9ADAD",
          300: "#F89999",
          400: "#F67F7F",
          500: "#F45F5F",
          600: "#C34C4C",
          700: "#9C3D3D",
          800: "#7D3131",
          900: "#642727",
        },
        grayscale: {
          50: "#F9F9F9",
          100: "#CAC9C9",
          200: "#BDBBBB",
          300: "#ADAAAA",
          400: "#999595",
          500: "#7F7A7A",
          600: "#666262",
          700: "#524E4E",
          800: "#423E3E",
          900: "#191818",
        },
        error: {
          50: "#FFD2D2",
          100: "#FFA4A4",
          200: "#FF8D8D",
          300: "#FF7070",
          400: "#FF4C4C",
          500: "#FF1F1F",
          600: "#CC1919",
          700: "#A31414",
          800: "#821010",
          900: "#680D0D",
        },
        white: "#FFFFFF",
        black: "#06070C",
        yellow: "#FFB915",
        blue: "#167BFF",
      },
      fontSize: {
        "l-headline": ["40px", { lineHeight: "100%", fontWeight: "500" }],
        "l-headline-bold": ["40px", { lineHeight: "100%", fontWeight: "700" }],
        "m-headline": ["36px", { lineHeight: "100%", fontWeight: "500" }],
        "m-headline-bold": ["36px", { lineHeight: "100%", fontWeight: "700" }],
        "s-headline": ["32px", { lineHeight: "100%", fontWeight: "500" }],
        "s-headline-bold": ["32px", { lineHeight: "100%", fontWeight: "700" }],
        title: ["28px", { lineHeight: "100%", fontWeight: "500" }],
        "title-bold": ["28px", { lineHeight: "100%", fontWeight: "700" }],
        "s-title": ["24px", { lineHeight: "100%", fontWeight: "500" }],
        "s-title-bold": ["24px", { lineHeight: "100%", fontWeight: "700" }],
        "l-body": ["20px", { lineHeight: "26px", fontWeight: "500" }],
        "l-body-bold": ["20px", { lineHeight: "100%", fontWeight: "700" }],
        body: ["16px", { lineHeight: "100%", fontWeight: "500" }],
        "body-bold": ["16px", { lineHeight: "100%", fontWeight: "700" }],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
