import path from "node:path";
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "h1,h2,h3,h4,h5,h6": {
              a: {
                textDecoration: "none",
              },
            },
          },
        },
      },
    },
  },
  content: [
    "./{src,content}/**/*.{ts,tsx,md,mdx,astro}",
    path.join(
      // eslint-disable-next-line no-undef
      path.dirname(require.resolve("@levino/shipyard-base")),
      "../astro/**/*.astro",
    ),
    path.join(
      // eslint-disable-next-line no-undef
      path.dirname(require.resolve("@levino/shipyard-docs")),
      "../astro/**/*.astro",
    ),
    path.join(
      // eslint-disable-next-line no-undef
      path.dirname(require.resolve("@levino/shipyard-blog")),
      "../astro/**/*.astro",
    ),
  ],
  plugins: [typography, daisyui],
};
