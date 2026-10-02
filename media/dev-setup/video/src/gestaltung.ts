import '@fontsource-variable/inter/index.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import { continueRender, delayRender } from 'remotion'

/**
 * Farben wie im Schaubild der Website (src/components/dev-setup/diagramData.ts):
 * Agent = Blau (info), Mensch = Orange (warning), Handy = Violett, Deploy = Grün (success).
 * Dunkler Grund, damit die Kanalfarben auch auf dem Handy leuchten.
 */
export const farben = {
  grund: '#0d1324',
  flaeche: '#151d33',
  flaecheHell: '#1d2742',
  rand: '#2c3a5e',
  text: '#eef2fa',
  gedaempft: '#93a0bd',
  agent: '#4ea8ff',
  mensch: '#ffaa33',
  handy: '#b48cff',
  deploy: '#3ddc97',
  fehler: '#ff5d6c',
} as const

export type Kanal = 'agent' | 'mensch' | 'handy' | 'deploy'

export const schriften = {
  text: '"Inter Variable", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const

const schriftenGeladen = delayRender('Schriften laden')
Promise.all([
  document.fonts.load('800 80px "Inter Variable"'),
  document.fonts.load('400 40px "Inter Variable"'),
  document.fonts.load('400 30px "JetBrains Mono"'),
  document.fonts.load('700 30px "JetBrains Mono"'),
])
  .then(() => continueRender(schriftenGeladen))
  .catch(() => continueRender(schriftenGeladen))
