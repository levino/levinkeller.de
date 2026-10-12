import { fileURLToPath } from 'node:url'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import shipyard from '@levino/shipyard-base'
import shipyardBlog from '@levino/shipyard-blog'
import shipyardDocs from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import { rehypePdfLinks } from './src/plugins/rehypePdfLinks'

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeKatex,
      rehypePdfLinks,
    ],
  },
  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },
  redirects: { '/': { destination: '/de', status: 302 } },

  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      redirectToDefaultLocale: false,
      prefixDefaultLocale: true,
      strategy: 'pathname',
    },
    fallback: {
      en: 'de',
    },
  },

  site: 'https://levinkeller.de',

  // Tailwind läuft als Vite-Plugin, nicht mehr über PostCSS: Astro 7 bringt
  // Vite 8 mit, dessen CSS-Resolver `@import "tailwindcss"` als Dateipfad
  // statt als Paketnamen behandelt. Der Build brach deshalb mit
  // `[postcss] ENOENT … open '/app/tailwindcss'` ab.
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.startsWith('https://levinkeller.de/private/') &&
        !page.includes('/hidden/') &&
        // /en/ hat keine eigenen Inhalte: die wenigen erzeugten Seiten zeigen
        // denselben deutschen Text, alle uebrigen Routen leiten auf /de/ um.
        // Beides gehoert nicht in die Sitemap. Ausnahme: die Dev-Setup-Doku,
        // die es wirklich auf Englisch gibt.
        (!page.startsWith('https://levinkeller.de/en/') ||
          page.startsWith('https://levinkeller.de/en/docs/dev-setup/')),
    }),
    mdx(),
    shipyard({
      css: fileURLToPath(new URL('./src/styles/app.css', import.meta.url)),
      navigation: {
        docs: {
          label: 'Wissen',
          href: '/docs',
        },
        blog: {
          label: 'Blog',
          href: '/blog',
        },
        work: {
          label: 'Levin',
          subEntry: {
            projects: {
              label: 'Projekte',
              href: '/work',
            },
            techStack: {
              label: 'Tech Stack',
              href: '/levin/tech-stack',
            },
            devSetup: {
              label: 'Dev-Setup',
              href: '/docs/dev-setup',
            },
            mindset: {
              label: 'Arbeitsweise',
              href: '/levin/mindset',
            },
          },
        },
        garden: {
          label: 'Garten',
          href: '/garden/docs',
          subEntry: {
            docs: {
              label: 'Doku',
              href: '/garden/docs',
            },
            plants: {
              label: 'Pflanzen',
              href: '/garden/plants/1',
            },
            shoppinglist: {
              label: 'Einkaufsliste',
              href: '/garden/shopping-list',
            },
            sowingCalendar: {
              label: 'Aussaatkalender',
              href: '/garden/sowing-calendar',
            },
            pflanzgruppen: {
              label: 'Pflanzgruppen',
              href: '/garden/docs/pflanzgruppen',
            },
          },
        },
        about: {
          label: 'About',
          href: '/about',
        },
      },
      // Zwei laufende Kampagnen in einer Leiste. Neutrale Farben (Dunkelblau mit
      // Gelb wie auf s4-muss-bleiben.de), nicht das CDU CI Kit: beide Kampagnen
      // laufen als Privatperson. Die id ändern, damit die Leiste auch bei denen
      // wieder erscheint, die sie schon weggeklickt haben.
      announcementBar: {
        id: 's4-und-waermenetz',
        content:
          '<strong>Die S4 muss bleiben:</strong> 2027 soll die S-Bahn Hannover–Hildesheim ein Jahr ausfallen. <a href="https://s4-muss-bleiben.de">Video ansehen und Brief schreiben &rarr;</a> &nbsp;·&nbsp; <strong>Wärmenetz Adensen-Hallerburg:</strong> kein 3,8-Mio.-€-Kredit der Gemeinde. <a href="https://waermenetz-adensen.levinkeller.de">Akten, Video, Podcast &rarr;</a>',
        backgroundColor: '#12325c',
        textColor: '#fbf7ef',
      },
      title: 'Levin Keller',
      tagline: 'Levins Homepage',
      brand: 'Levin Keller',
      // Default social/Open Graph card (1200x630) used when a page sets no
      // `image:` of its own, so links unfurl with a preview everywhere.
      defaultImage: '/og-default.jpg',
      footer: {
        links: [
          { label: 'Impressum', to: '/imprint' },
          { label: 'About', to: '/about' },
        ],
        copyright: `&copy; ${new Date().getFullYear()} Levin Keller`,
      },
      scripts: [
        {
          src: 'https://analytics.levinkeller.de/js/script.js',
          defer: true,
          'data-domain': 'levinkeller.de',
        },
      ],
    }),
    shipyardDocs({
      editUrl:
        'https://github.com/levino/levinkeller.de/edit/main/content/docs',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
    shipyardDocs({
      routeBasePath: 'garden',
      collectionName: 'gardenDocs',
      editUrl:
        'https://github.com/levino/levinkeller.de/edit/main/content/gardenDocs',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
    shipyardBlog({
      editUrl:
        'https://github.com/levino/levinkeller.de/edit/main/content/blog',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
  ],
})
