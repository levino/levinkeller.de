import { type CollectionEntry, getCollection } from 'astro:content'
import type { APIRoute, GetStaticPaths } from 'astro'
import { renderRecipesPdf } from '@/recipes/pdf'

export const getStaticPaths = (async () =>
  (await getCollection('recipes')).map((recipe) => ({
    params: { id: recipe.id },
    props: { recipe },
  }))) satisfies GetStaticPaths

export const GET: APIRoute<{ recipe: CollectionEntry<'recipes'> }> = ({
  props: { recipe },
}) =>
  new Response(renderRecipesPdf(recipe.data.title, [recipe]), {
    headers: { 'Content-Type': 'application/pdf' },
  })
