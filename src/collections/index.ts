import { defineCollection, reference, z } from 'astro:content'
import { file, glob } from 'astro/loaders'
import { parse as parseYaml } from 'yaml'
import { plantSchema } from './plantSchema'
import { sowingLogSchema } from './sowingLogSchema'
import { vegetablesSchema } from './vegetableSchema'

const supplierSchema = z.object({
  name: z.string(),
  url: z.string(),
})

const seedItemSchema = z.object({
  vegetable: reference('vegetables').optional(),
  plant: reference('plants').optional(),
  sorte: z.string().optional(),
  notiz: z.string().optional(),
})

const seedsToBuySchema = z.object({
  saison: z.coerce.date(),
  samen: z.array(seedItemSchema),
})

export const collections = {
  seedsToBuy: defineCollection({
    schema: seedsToBuySchema,
    loader: file('./content/seedsToBuy.yaml', {
      parser: (text) =>
        (parseYaml(text) as Record<string, unknown>[]).map((entry, index) => ({
          ...entry,
          id: String(index),
        })),
    }),
  }),
  plants: defineCollection({
    loader: glob({
      pattern: '*.yaml',
      base: './content/plants',
    }),
    schema: plantSchema,
  }),
  suppliers: defineCollection({
    loader: glob({
      pattern: '**/*.yaml',
      base: './content/suppliers',
    }),
    schema: supplierSchema,
  }),
  plantDescriptions: defineCollection({
    loader: glob({
      pattern: '**/*.md',
      base: './content/plantDescriptions',
    }),
    schema: z.object({
      plant: reference('plants'),
    }),
  }),
  vegetables: defineCollection({
    loader: glob({
      pattern: '**/*.yaml',
      base: './content/vegetables',
    }),
    schema: vegetablesSchema,
  }),
  sowingLog: defineCollection({
    loader: glob({
      pattern: '*.yaml',
      base: './content/sowingLog',
    }),
    schema: sowingLogSchema,
  }),
  plantStock: defineCollection({
    schema: z.object({
      plant: reference('plants'),
      inStock: z.boolean(),
    }),
    loader: file('./content/plantStock.yaml', {
      parser: (text) =>
        Object.entries(parseYaml(text)).map(([plant, inStock], id) => ({
          plant,
          inStock,
          id,
        })),
    }),
  }),
}
