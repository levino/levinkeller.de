import { defineCollection, reference, z } from 'astro:content'
import { file, glob } from 'astro/loaders'
import { parse as parseYaml } from 'yaml'
import { plantSchema } from './plantSchema'
import { vegetablesSchema } from './vegetableSchema'

const supplierSchema = z.object({
  name: z.string(),
  url: z.string(),
})

export const collections = {
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
  beds: defineCollection({
    loader: glob({
      pattern: '**/*.md',
      base: './content/beds',
    }),
    schema: z.object({
      plants: z.array(reference('plants')),
      name: z.string(),
    }),
  }),
  vegetables: defineCollection({
    loader: glob({
      pattern: '**/*.yaml',
      base: './content/vegetables',
    }),
    schema: vegetablesSchema,
  }),
  vegetableStock: defineCollection({
    schema: z.object({
      vegetable: reference('vegetables'),
      inStock: z.boolean(),
    }),
    loader: file('./content/vegetableStock.yaml', {
      parser: (text) =>
        Object.entries(parseYaml(text)).map(([vegetable, inStock], id) => ({
          vegetable,
          inStock,
          id,
        })),
    }),
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
