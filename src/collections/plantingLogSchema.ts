import { reference, z } from 'astro:content'

const plantingLogEntry = z.object({
  vegetable: reference('vegetables'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'),
})

export const plantingLogSchema = z.object({
  entries: z.array(plantingLogEntry).default([]),
})
