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
      {
        'professional-dark': {
          // Primary: Brighter blue for dark mode
          primary: '#3b82f6',
          'primary-content': '#ffffff',

          // Secondary: Lighter slate for visibility
          secondary: '#94a3b8',
          'secondary-content': '#0f172a',

          // Accent: Brighter teal for dark mode
          accent: '#14b8a6',
          'accent-content': '#0f172a',

          // Neutral: Light text on dark
          neutral: '#e2e8f0',
          'neutral-content': '#0f172a',

          // Base colors - dark with clear distinction
          'base-100': '#0f172a', // Dark navy background
          'base-200': '#1e293b', // Slate - clearly visible difference
          'base-300': '#334155', // Lighter slate - even more distinct
          'base-content': '#f1f5f9', // Light text for readability

          // Semantic colors - slightly brighter for dark mode
          info: '#60a5fa',
          'info-content': '#0f172a',
          success: '#4ade80',
          'success-content': '#0f172a',
          warning: '#fbbf24',
          'warning-content': '#0f172a',
          error: '#f87171',
          'error-content': '#0f172a',

          // Same rounded corners
          '--rounded-box': '0.5rem',
          '--rounded-btn': '0.375rem',
          '--rounded-badge': '1rem',
          '--tab-radius': '0.375rem',
        },
      },
    ],
    // Auto-switch based on system preference (prefers-color-scheme)
    darkTheme: 'professional-dark',
  },
}
