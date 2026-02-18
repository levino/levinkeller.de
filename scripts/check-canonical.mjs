import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const SITE = 'https://www.levinkeller.de'
const BUILD_DIR = '.vercel/output/static'

async function* findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* findHtmlFiles(path)
    } else if (entry.name.endsWith('.html')) {
      yield path
    }
  }
}

function isRedirectPage(html) {
  return html.includes('Redirecting to:')
}

function extractCanonical(html) {
  const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)
  return match?.[1] ?? null
}

function getUrlPath(filePath) {
  return (
    '/' +
    filePath
      .replace(`${BUILD_DIR}/`, '')
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
  )
}

const errors = []
let checked = 0
let skipped = 0

for await (const file of findHtmlFiles(BUILD_DIR)) {
  const html = await readFile(file, 'utf-8')
  const urlPath = getUrlPath(file)

  if (isRedirectPage(html)) {
    skipped++
    continue
  }

  checked++
  const canonical = extractCanonical(html)

  if (!canonical) {
    errors.push(`Missing canonical: ${urlPath}`)
    continue
  }

  if (!canonical.startsWith(SITE)) {
    errors.push(`Wrong domain in canonical: ${urlPath} -> ${canonical}`)
    continue
  }

  // /en/ pages must point to /de/
  if (urlPath.startsWith('/en/') && canonical.includes('/en/')) {
    errors.push(
      `EN page canonical should point to /de/: ${urlPath} -> ${canonical}`
    )
  }
}

console.log(`Checked ${checked} pages (${skipped} redirects skipped)`)

if (errors.length > 0) {
  console.log(`\n${errors.length} issues found:\n`)
  for (const error of errors) {
    console.log(`  - ${error}`)
  }
  process.exit(1)
} else {
  console.log('All pages have valid canonical URLs.')
}
