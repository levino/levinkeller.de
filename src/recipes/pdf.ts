import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'
import type { Recipe } from '../collections/recipeSchema'
import { layoutRecipe } from './layout'
import template from './recipes.typ?raw'

let compiler: NodeCompiler | undefined

/** Setzt die Rezepte mit Typst als PDF, jedes Rezept auf eine eigene Seite. */
export const renderRecipesPdf = (
  title: string,
  recipes: { id: string; data: Recipe }[]
): Uint8Array<ArrayBuffer> => {
  compiler ??= NodeCompiler.create()
  const data = {
    title,
    recipes: recipes.map(({ id, data }) => ({
      ...data,
      id,
      grid: layoutRecipe(data.process),
    })),
  }
  return new Uint8Array(
    compiler.pdf({
      mainFileContent: template,
      inputs: { data: JSON.stringify(data) },
    })
  )
}
