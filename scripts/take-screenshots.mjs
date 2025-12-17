#!/usr/bin/env node
/**
 * Takes screenshots of portfolio projects using Playwright.
 *
 * Usage: node scripts/take-screenshots.mjs
 *
 * Prerequisites:
 *   npm install -D playwright
 *   npx playwright install chromium
 *   npx playwright install-deps chromium
 */

import { chromium } from 'playwright'

const projects = [
  { url: 'https://github.com/levino/shipyard', name: 'shipyard-preview' },
  { url: 'https://github.com/levino/mock-jwks', name: 'mock-jwks-preview' },
  { url: 'https://coding-class.levinkeller.de/', name: 'coding-class-preview' },
  { url: 'https://go-ag.levinkeller.de/', name: 'go-ag-preview' },
  {
    url: 'https://nordstemmen-mcp.levinkeller.de/',
    name: 'nordstemmen-mcp-preview',
  },
  { url: 'https://www.xn--rssing-wxa.de/', name: 'roessing-preview' },
  { url: 'https://archiv.xn--rssing-wxa.de/', name: 'roessing-archiv-preview' },
  {
    url: 'https://haushalt-nordstemmen.pages.dev/',
    name: 'haushalt-nordstemmen-preview',
  },
]

const OUTPUT_DIR = './public/images/projects'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  for (const project of projects) {
    console.log(`Taking screenshot of ${project.url}...`)
    try {
      await page.goto(project.url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.screenshot({
        path: `${OUTPUT_DIR}/${project.name}.png`,
        fullPage: false,
      })
      console.log(`  Saved ${project.name}.png`)
    } catch (e) {
      console.error(`  Error: ${e.message}`)
    }
  }

  await browser.close()
  console.log('Done!')
}

main()
