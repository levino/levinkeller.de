import { reference, type SchemaContext, z } from 'astro:content'

import { MONTHS_EN } from '@levino/shipyard-base'

const months = z.enum(MONTHS_EN)

// Jelitto Sowing Directions (SD) — encode the full germination protocol:
// SD1:  Classic cold germinator — warm 18–22°C 2–4 wks → cold −4/+4°C 4–6 wks → germinate 5–12°C
// SD5:  Hard cold germinator   — sow at max 5°C outdoors, irregular germination over months
// SD6:  Extreme germinator     — stratify in moist sand outdoors, can take 1+ year
// SD8:  Variable cold germinator — cold stratification required, germination erratic over months
// SD9:  Warm germinator, optional cold — germinates well at 18–20°C; cold pre-treatment optional
// SD15: Warm germinator        — sow at ~20°C, germinates in days to 2–3 weeks
// SD16: Warm germinator, slow  — sow at 20–22°C, germination slow or irregular
const SOWING_DIRECTIONS = [
  'SD1',
  'SD5',
  'SD6',
  'SD8',
  'SD9',
  'SD15',
  'SD16',
] as const

type month = (typeof MONTHS_EN)[number]

export const plantSchema = ({ image }: SchemaContext) =>
  z
    .object({
      name: z.object({ latin: z.string(), german: z.string() }),
      description: z.string().optional(),
      height: z.number(),
      soil: z.array(z.enum(['moist', 'dry', 'normal', 'wet'])),
      sunExposure: z.array(
        z.enum(['full', 'semi-shade', 'shade', 'light-shade'])
      ),
      hardiness: z.enum(['hardy', 'tender']),
      spread: z.number().optional(),
      voleVulnerable: z.boolean().optional(),
      germination: z
        .object({
          dark: z.boolean().default(false),
          light: z.boolean().default(false),
        })
        .optional()
        .default({ dark: false, light: false }),
      flowerColor: z.array(
        z.enum([
          'wine-red',
          'red',
          'blue',
          'yellow',
          'white',
          'pink',
          'green',
          'brown',
          'orange',
          'violet',
          'rose',
          'black',
          'purple',
        ])
      ),
      toSow: z.boolean().default(true),
      foliageColor: z.enum(['green', 'red', 'silver', 'gold']),
      lifecycle: z.enum(['annual', 'perennial', 'biennial', 'shrub', 'tree']),
      sowingTime: z.array(months).optional(),
      sowingDirection: z.enum(SOWING_DIRECTIONS).optional(),
      floweringSeason: z.array(months),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
          })
        )
        .optional(),
      inStock: z.boolean().default(false),
      url: z.string().url().optional(),
      supplier: reference('suppliers'),
    })
    .transform(({ sowingTime, ...data }) => {
      if (sowingTime) {
        return { ...data, sowingTime }
      }
      throw new Error('You need to set a `sowingTime`.')
    })
