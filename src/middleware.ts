import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next()

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('text/html')) return response

  const html = await response.text()

  // Don't inject if a canonical tag already exists
  if (html.includes('rel="canonical"')) {
    return new Response(html, {
      status: response.status,
      headers: response.headers,
    })
  }

  const path = context.url.pathname

  // Only process paths with a known locale prefix
  const localeMatch = path.match(/^\/(de|en)(\/|$)/)
  if (!localeMatch) {
    return new Response(html, {
      status: response.status,
      headers: response.headers,
    })
  }

  const currentLocale = localeMatch[1]
  const site = context.site?.origin ?? 'https://www.levinkeller.de'

  // Canonical always points to the /de/ version (German is the original)
  const canonicalPath =
    currentLocale !== 'de'
      ? path.replace(new RegExp(`^/${currentLocale}(/|$)`), '/de$1')
      : path
  const canonicalUrl = `${site}${canonicalPath}`

  const tag = `<link rel="canonical" href="${canonicalUrl}" />`
  const modifiedHtml = html.replace('</head>', `    ${tag}\n  </head>`)

  return new Response(modifiedHtml, {
    status: response.status,
    headers: response.headers,
  })
})
