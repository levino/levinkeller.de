import { z } from 'astro/zod'
import type { RecipeNode, Step } from '../recipes/layout'

const actionSchema = z.union([z.string(), z.array(z.string()).min(1)])

const nodeSchema: z.ZodType<RecipeNode> = z.lazy(() =>
  z.union([
    z.string(),
    z.strictObject({ ingredient: z.string(), action: actionSchema.optional() }),
    stepSchema,
  ])
)

const stepSchema: z.ZodType<Step> = z.lazy(() =>
  z.strictObject({ action: actionSchema, with: z.array(nodeSchema).min(1) })
)

export const recipeSchema = z.object({
  title: z.string(),
  /** z. B. „für 4 Personen“ oder „etwa 8 Knödel“ */
  servings: z.string().optional(),
  /** Gesamtzeit, z. B. „ca. 1 Std.“ */
  time: z.string().optional(),
  description: z.string().optional(),
  /** Vorbereitung, die über der ganzen Tabelle steht (Ofen vorheizen …) */
  prep: z.array(z.string()).default([]),
  process: stepSchema,
  tips: z.array(z.string()).default([]),
  source: z.object({ text: z.string(), url: z.url().optional() }).optional(),
})

export type Recipe = z.infer<typeof recipeSchema>
