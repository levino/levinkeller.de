import { z } from 'astro:content'

const sowingLogEntry = z.object({
  vegetable: z.string(),
  succession: z.number().default(1),
  week: z.number(),
})

export const sowingLogSchema = z.object({
  entries: z.array(sowingLogEntry).default([]),
})
