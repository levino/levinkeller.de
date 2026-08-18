import { fileURLToPath } from 'node:url'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import shipyard from '@levino/shipyard-base'
import shipyardBlog from '@levino/shipyard-blog'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeKatex,
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

  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.startsWith('https://levinkeller.de/private/') &&
        !page.includes('/hidden/') &&
        // /en/ hat keine eigenen Inhalte: die wenigen erzeugten Seiten zeigen
        // denselben deutschen Text, alle uebrigen Routen leiten auf /de/ um.
        // Beides gehoert nicht in die Sitemap.
        !page.startsWith('https://levinkeller.de/en/'),
    }),
    mdx(),
    shipyard({
      css: fileURLToPath(new URL('./src/styles/app.css', import.meta.url)),
      // Der Eintrag ist bewusst als `html` gesetzt: Shipyard stellt `href`-Werte
      // aus der Navigation das Locale-Präfix voran (`/de…`), was einen externen
      // Link zerschießen würde.
      navigation: {
        kreistag: {
          html: '<a href="https://kreistag.levinkeller.de">Kreistag 2026</a>',
        },
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
      // Farben aus dem CDU CI Kit (Cadenabbia-Türkis auf Rhöndorf-Blau), nicht
      // aus dem DaisyUI-Theme dieser Seite — das ist rosa.
      announcementBar: {
        id: 'kreistag-2026',
        content:
          'Kommunalwahl am 13. September 2026: Ich kandidiere für den Kreistag Hildesheim. <a href="https://kreistag.levinkeller.de">Zur Seite meiner Kreistagskandidatur &rarr;</a>',
        backgroundColor: '#52b7c1',
        textColor: '#2d3c4b',
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
