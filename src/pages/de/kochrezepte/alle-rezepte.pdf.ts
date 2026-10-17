import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'
import { renderRecipesPdf } from '@/recipes/pdf'

export const GET: APIRoute = async () => {
  const recipes = (await getCollection('recipes')).sort((a, b) =>
    a.data.title.localeCompare(b.data.title, 'de')
  )
  return new Response(renderRecipesPdf('Kochrezepte', recipes), {
    headers: { 'Content-Type': 'application/pdf' },
  })
}
