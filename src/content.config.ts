import { defineCollection } from 'astro:content'
import { blogSchema } from '@levino/shipyard-blog'
import { docsSchema } from '@levino/shipyard-docs'
import { glob } from 'astro/loaders'
import { collections as plantCollections } from './collections/index.ts'

// 3. Define your collection(s)
const blog = defineCollection({
  schema: ({ image }) => blogSchema({ image }),
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog' }),
})
const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/docs' }),
})

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, docs, ...plantCollections }
