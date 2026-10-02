import type React from 'react'
import { Szene01Start } from './Szene01Start'
import { Szene02Mieten } from './Szene02Mieten'
import { Szene03Laptop } from './Szene03Laptop'
import { Szene04Ueberall } from './Szene04Ueberall'
import { Szene05Sprechen } from './Szene05Sprechen'
import { Szene06Tailnet } from './Szene06Tailnet'
import { Szene07Spawn } from './Szene07Spawn'
import { Szene08Wegwerfbar } from './Szene08Wegwerfbar'
import { Szene09Arbeitsplatz } from './Szene09Arbeitsplatz'
import { Szene10Rueckfragen } from './Szene10Rueckfragen'
import { Szene11Codespaces } from './Szene11Codespaces'
import { Szene12Handy } from './Szene12Handy'
import { Szene13Agent } from './Szene13Agent'
import { Szene14Mensch } from './Szene14Mensch'
import { Szene15Grenze } from './Szene15Grenze'
import { Szene16Abspann } from './Szene16Abspann'

/** Bild je Szenennummer aus skript.<sprache>.md */
export const szenen: Record<number, React.FC> = {
  1: Szene01Start,
  2: Szene02Mieten,
  3: Szene03Laptop,
  4: Szene04Ueberall,
  5: Szene05Sprechen,
  6: Szene06Tailnet,
  7: Szene07Spawn,
  8: Szene08Wegwerfbar,
  9: Szene09Arbeitsplatz,
  10: Szene10Rueckfragen,
  11: Szene11Codespaces,
  12: Szene12Handy,
  13: Szene13Agent,
  14: Szene14Mensch,
  15: Szene15Grenze,
  16: Szene16Abspann,
}
