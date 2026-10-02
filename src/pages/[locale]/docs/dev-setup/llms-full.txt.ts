import { getCollection } from 'astro:content'
import type { APIRoute, GetStaticPaths } from 'astro'

// Volltext der Dev-Setup-Doku als eine Textdatei, zum Einfügen in ein
// Sprachmodell. Die kompakte llms.txt liegt handgeschrieben unter public/.
export const getStaticPaths = (() =>
  ['de', 'en'].map((locale) => ({
    params: { locale },
  }))) satisfies GetStaticPaths

const stripMdx = (body: string) =>
  body
    .split('\n')
    .filter((line) => !/^import\s/.test(line) && !/^<\w+[^>]*\/>$/.test(line))
    .join('\n')
    .replace(/<div[\s\S]*?<\/div>\s*<\/div>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

export const GET: APIRoute = async ({ params }) => {
  const prefix = `${params.locale}/dev-setup`
  const entries = await getCollection('docs', ({ id }) => id.startsWith(prefix))
  const isIndex = (id: string) => id === prefix || id === `${prefix}/index`
  const sorted = entries.toSorted(
    (a, b) =>
      Number(isIndex(b.id)) - Number(isIndex(a.id)) ||
      (a.data.sidebar?.position ?? 99) - (b.data.sidebar?.position ?? 99)
  )
  const text = sorted
    .map(({ id, body }) => {
      const slug = isIndex(id) ? '' : `${id.slice(prefix.length + 1)}/`
      return `<!-- https://levinkeller.de/${params.locale}/docs/dev-setup/${slug} -->\n\n${stripMdx(body ?? '')}`
    })
    .join('\n\n---\n\n')
  return new Response(`${text}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
