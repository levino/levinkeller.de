import type React from 'react'
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { SzenenAnbieter } from './bausteine'
import { farben, schriften } from './gestaltung'
import { szenen } from './szenen/verzeichnis'
import { type Sprache, type SzenenZeit, szenenZeiten } from './zeitplan'

const klemmen = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

/** Stimme weich ein- und ausblenden, damit an den Kanten nichts knackt */
const lautstaerke = (szene: SzenenZeit) => (bild: number) =>
  interpolate(bild, [0, 1, szene.audioBilder - 4, szene.audioBilder], [0, 1, 1, 0], klemmen)

const SzenenRahmen: React.FC<{ szene: SzenenZeit; sprache: Sprache; letzte: boolean }> = ({ szene, sprache, letzte }) => {
  const bild = useCurrentFrame()
  const Inhalt = szenen[szene.nummer]
  const deckkraft =
    interpolate(bild, [0, 10], [0, 1], klemmen) * (letzte ? 1 : interpolate(bild, [szene.dauerInBildern - 8, szene.dauerInBildern], [1, 0], klemmen))
  return (
    <SzenenAnbieter value={{ sprache, szene }}>
      <AbsoluteFill style={{ opacity: deckkraft }}>
        {szene.nummer > 1 && (
          <div style={{ position: 'absolute', left: 80, top: 56, display: 'flex', alignItems: 'baseline', gap: 22 }}>
            <span style={{ fontFamily: schriften.mono, fontSize: 30, color: farben.gedaempft }}>
              {String(szene.nummer).padStart(2, '0')}
            </span>
            <span style={{ fontFamily: schriften.text, fontSize: 52, fontWeight: 800, color: farben.text, letterSpacing: -0.5 }}>
              {szene.titel}
            </span>
          </div>
        )}
        <Inhalt />
      </AbsoluteFill>
      <Sequence from={szene.audioBeginn} layout="none">
        <Audio src={staticFile(szene.audioDatei)} volume={lautstaerke(szene)} />
      </Sequence>
    </SzenenAnbieter>
  )
}

export const Film: React.FC<{ sprache: Sprache }> = ({ sprache }) => {
  const zeiten = szenenZeiten(sprache)
  return (
    <AbsoluteFill
      style={{
        backgroundColor: farben.grund,
        backgroundImage: `radial-gradient(${farben.flaecheHell} 2px, transparent 2px)`,
        backgroundSize: '48px 48px',
      }}
    >
      {zeiten.map((szene, index) => (
        <Sequence key={szene.nummer} from={szene.beginn} durationInFrames={szene.dauerInBildern} name={`Szene ${szene.nummer}`}>
          <SzenenRahmen szene={szene} sprache={sprache} letzte={index === zeiten.length - 1} />
        </Sequence>
      ))}
      <div style={{ position: 'absolute', right: 70, bottom: 44, fontFamily: schriften.mono, fontSize: 26, color: farben.gedaempft }}>
        levinkeller.de
      </div>
    </AbsoluteFill>
  )
}
