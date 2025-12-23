import path from 'node:path'
import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'h1,h2,h3,h4,h5,h6': {
              a: {
                textDecoration: 'none',
              },
            },
          },
        },
      },
    },
  },
  content: [
    './{src,content}/**/*.{ts,tsx,md,mdx,astro}',
    path.join(
      // eslint-disable-next-line no-undef
      path.dirname(require.resolve('@levino/shipyard-base')),
      '../astro/**/*.astro'
    ),
    path.join(
      // eslint-disable-next-line no-undef
      path.dirname(require.resolve('@levino/shipyard-docs')),
      '../astro/**/*.astro'
    ),
    path.join(
      // eslint-disable-next-line no-undef
      path.dirname(require.resolve('@levino/shipyard-blog')),
      '../astro/**/*.astro'
    ),
  ],
  plugins: [typography, daisyui],
  daisyui: {
    themes: [
      'retro',
      {
        'forest-custom': {
          'color-scheme': 'dark',
          // Forest greens
          primary: '#1eb854',
          'primary-content': '#000000',
          secondary: '#1DB88E',
          accent: '#1DB8AB',
          neutral: '#19362D',
          'neutral-content': '#d4e5df',
          // Base colors with clear distinction
          'base-100': '#171212', // Original forest dark
          'base-200': '#251d1d', // Noticeably lighter
          'base-300': '#352a2a', // Even more distinct
          'base-content': '#e8e4e4',
          // Semantic colors
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
          // Keep forest's rounded buttons
          '--rounded-btn': '1.9rem',
        },
      },
    ],
    darkTheme: 'forest-custom',
  },
}
