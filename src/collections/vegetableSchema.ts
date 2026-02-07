import { z } from 'astro:content'
import { MONTHS_EN } from '@levino/shipyard-base'

const months = z.enum(MONTHS_EN)

const timing = z.enum([
  'early',
  'mid',
  'late',
  'early-mid',
  'mid-late',
  '1st-half',
  '2nd-half',
  'full',
])

const sowingEntry = z.object({
  month: months,
  timing: timing.default('full'),
  succession: z.number().default(1),
  underCover: z.boolean().default(false),
  overwintering: z.boolean().default(false),
  note: z.string().optional(),
})

export const vegetablesSchema = z.object({
  name: z.string(),
  sowings: z.array(sowingEntry),
})
