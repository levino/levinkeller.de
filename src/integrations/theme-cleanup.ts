import type { AstroIntegration } from 'astro'

/**
 * Astro integration that removes manually-set theme data so
 * DaisyUI's --prefersdark media-query controls light/dark automatically.
 */
export default function themeCleanup(): AstroIntegration {
  return {
    name: 'theme-cleanup',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript(
          'page',
          `localStorage.removeItem('theme');document.documentElement.removeAttribute('data-theme');`
        )
      },
    },
  }
}
