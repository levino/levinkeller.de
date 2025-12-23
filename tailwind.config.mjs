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
      {
        professional: {
          // Primary: Deep blue - trust and professionalism
          primary: '#2563eb',
          'primary-content': '#ffffff',

          // Secondary: Slate blue - subtle accent
          secondary: '#64748b',
          'secondary-content': '#ffffff',

          // Accent: Teal - fresh and modern
          accent: '#0d9488',
          'accent-content': '#ffffff',

          // Neutral: Dark slate for text
          neutral: '#1e293b',
          'neutral-content': '#f8fafc',

          // Base colors with clear distinction
          'base-100': '#ffffff', // Pure white background
          'base-200': '#f1f5f9', // Light slate - clearly visible difference
          'base-300': '#e2e8f0', // Slate - even more distinct
          'base-content': '#1e293b', // Dark text for readability

          // Semantic colors
          info: '#3b82f6',
          'info-content': '#ffffff',
          success: '#22c55e',
          'success-content': '#ffffff',
          warning: '#f59e0b',
          'warning-content': '#1e293b',
          error: '#ef4444',
          'error-content': '#ffffff',

          // Rounded corners for a softer look
          '--rounded-box': '0.5rem',
          '--rounded-btn': '0.375rem',
          '--rounded-badge': '1rem',
          '--tab-radius': '0.375rem',
        },
      },
    ],
  },
}
