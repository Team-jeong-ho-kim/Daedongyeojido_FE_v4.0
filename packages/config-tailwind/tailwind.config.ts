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
    // ... 공용 테마 ...
  },
  plugins: [tailwindcssAnimate],
};

export default config;
