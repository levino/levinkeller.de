import type React from 'react'
import { Szene1Frage } from './Szene1Frage'
import { Szene2Server } from './Szene2Server'
import { Szene3Tailnet } from './Szene3Tailnet'
import { Szene4Hatchery } from './Szene4Hatchery'
import { Szene5Agent } from './Szene5Agent'
import { Szene6Mensch } from './Szene6Mensch'
import { Szene7Arbeitsplatz } from './Szene7Arbeitsplatz'
import { Szene8Grenze } from './Szene8Grenze'
import { Szene9Abspann } from './Szene9Abspann'

/** Bild je Szenennummer aus skript.<sprache>.md */
export const szenen: Record<number, React.FC> = {
  1: Szene1Frage,
  2: Szene2Server,
  3: Szene3Tailnet,
  4: Szene4Hatchery,
  5: Szene5Agent,
  6: Szene6Mensch,
  7: Szene7Arbeitsplatz,
  8: Szene8Grenze,
  9: Szene9Abspann,
}
