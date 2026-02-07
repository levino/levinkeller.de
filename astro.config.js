import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'
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

  site: 'https://www.levinkeller.de',

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !page.startsWith('https://www.levinkeller.de/private/'),
    }),
    mdx(),
    shipyard({
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
            mindset: {
              label: 'Arbeitsweise',
              href: '/levin/mindset',
            },
          },
        },
        garden: {
          label: 'Garten',
          href: '/garden',
          subEntry: {
            principles: {
              label: 'Grundsätze',
              href: '/garden/grundsaetze',
            },
            naturgarten: {
              label: 'Naturgarten-Projekt',
              href: '/garden',
            },
            staudenbeete: {
              label: 'Staudenbeete im Bestand',
              href: '/garden/staudenbeete-im-bestand',
            },
            seedlingFertilization: {
              label: 'Jungpflanzen düngen',
              href: '/garden/duengung-jungpflanzen',
            },
            meadow: {
              label: 'Blumenwiese',
              href: '/garden/meadow',
            },
            beds: {
              label: 'Beetplaner',
              href: '/garden/beds',
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
          },
        },
        about: {
          label: 'About',
          href: '/about',
        },
      },
      title: 'Levin Keller',
      tagline: 'Levins Homepage',
      brand: 'Levin Keller',
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

  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
})
