import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'
import { rehypePdfLinks } from './rehypePdfLinks'

const run = (html: string) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypePdfLinks)
    .use(rehypeStringify)
    .processSync(html)
    .toString()

describe('rehypePdfLinks', () => {
  it('öffnet PDF-Links in neuem Tab', () => {
    expect(run('<a href="/assets/a.pdf">A</a>')).toBe(
      '<a href="/assets/a.pdf" target="_blank" rel="noopener">A</a>'
    )
  })

  it('erkennt PDFs mit Anker oder Query', () => {
    expect(run('<a href="/a.PDF#page=2">A</a>')).toContain('target="_blank"')
  })

  it('lässt andere Links und Download-Links unverändert', () => {
    expect(run('<a href="/de/docs/">A</a>')).toBe('<a href="/de/docs/">A</a>')
    expect(run('<a href="/a.pdf" download>A</a>')).toBe(
      '<a href="/a.pdf" download>A</a>'
    )
  })
})
