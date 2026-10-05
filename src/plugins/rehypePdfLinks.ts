import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'

const isPdfHref = (href: unknown): href is string =>
  typeof href === 'string' && /\.pdf(?:[?#].*)?$/i.test(href)

/**
 * Links auf PDFs öffnen in einem neuen Tab statt im selben Fenster. Der
 * Browser zeigt sie dort mit seinem PDF-Viewer an, und die Seite, von der
 * man kam, bleibt offen. Links mit `download`-Attribut bleiben unverändert.
 */
export const rehypePdfLinks = () => (tree: Root) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName !== 'a') return
    const { href, download } = node.properties
    if (!isPdfHref(href) || download !== undefined) return
    node.properties.target = '_blank'
    node.properties.rel = ['noopener']
  })
}
