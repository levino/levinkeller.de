import { reference, z } from 'astro:content'

export const plantingLogSchema = z.object({
  vegetable: reference('vegetables'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'),
  /** Reference to the sowing entry that produced these plants (required for Vorkultur) */
  sowing: reference('sowingLog').optional(),
})
