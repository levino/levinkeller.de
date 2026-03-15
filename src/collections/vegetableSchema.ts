import { z } from 'astro:content'

const sowingWindow = z.object({
  from: z.number().min(1).max(53),
  until: z.number().min(1).max(53),
  successionIntervalWeeks: z.number().optional(),
  underCover: z.boolean().default(false),
  overwintering: z.boolean().default(false),
  note: z.string().optional(),
})

export const vegetablesSchema = z.object({
  name: z.string(),
  skip: z.boolean().default(false),
  sowingWindows: z.array(sowingWindow),
})
