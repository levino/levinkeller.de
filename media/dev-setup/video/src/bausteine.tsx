import type React from 'react'
import { createContext, useContext } from 'react'
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { farben, schriften } from './gestaltung'
import type { Sprache, SzenenZeit } from './zeitplan'

export type Text = Record<Sprache, string>

const SzenenKontext = createContext<{ sprache: Sprache; szene: SzenenZeit } | null>(null)
export const SzenenAnbieter = SzenenKontext.Provider

const klemmen = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

/**
 * Alles, was eine Szene zum Takten braucht. `bei(wort)` schätzt das Bild, an dem ein Wort gesprochen wird:
 * Position des Worts im Sprechertext, anteilig auf die Sprechdauer umgelegt. Grob, aber nah genug,
 * damit Bild und Stimme zusammenpassen, auch nach einer Neuvertonung.
 */
export function useSzene() {
  const kontext = useContext(SzenenKontext)
  if (!kontext) throw new Error('useSzene außerhalb einer Szene')
  const { sprache, szene } = kontext
  const bild = useCurrentFrame()
  const { fps } = useVideoConfig()
  const t = (text: Text | string) => (typeof text === 'string' ? text : text[sprache])
  const bei = (wort: Text | string, versatz = 0) => {
    const gesucht = t(wort).toLowerCase()
    const stelle = szene.text.toLowerCase().indexOf(gesucht)
    if (stelle < 0) {
      console.warn(`Szene ${szene.nummer}: „${gesucht}“ nicht im Sprechertext`)
      return szene.audioBeginn + versatz
    }
    return Math.round(szene.audioBeginn + (stelle / szene.text.length) * szene.audioBilder + versatz)
  }
  return { sprache, szene, bild, fps, t, bei }
}

export const einblenden = (bild: number, ab: number, dauer = 12) =>
  interpolate(bild, [ab, ab + dauer], [0, 1], { ...klemmen, easing: Easing.out(Easing.cubic) })

export const feder = (bild: number, ab: number, fps: number) =>
  spring({ frame: bild - ab, fps, config: { damping: 15, mass: 0.7 } })

/** Blendet Kinder ab einem Bild ein (leicht von unten oder skaliert) */
export const Erscheinen: React.FC<{
  ab: number
  art?: 'unten' | 'skalieren' | 'blenden'
  bis?: number
  style?: React.CSSProperties
  children: React.ReactNode
}> = ({ ab, art = 'unten', bis, style, children }) => {
  const { bild, fps } = useSzene()
  const f = feder(bild, ab, fps)
  const aus = bis === undefined ? 1 : 1 - einblenden(bild, bis, 10)
  const transform =
    art === 'unten' ? `translateY(${(1 - f) * 30}px)` : art === 'skalieren' ? `scale(${0.6 + 0.4 * f})` : undefined
  return (
    <div style={{ ...style, opacity: Math.min(1, f * 1.4) * aus, transform: [style?.transform, transform].filter(Boolean).join(' ') }}>
      {children}
    </div>
  )
}

/** Baustein wie im Schaubild: Kasten mit Titel und Unterzeile, positioniert über seinen Mittelpunkt */
export const Karte: React.FC<{
  x: number
  y: number
  w?: number
  h?: number
  titel: React.ReactNode
  unter?: React.ReactNode
  farbe?: string
  ab: number
  bis?: number
  symbol?: React.ReactNode
  gestrichelt?: boolean
  leuchten?: number
  monoUnter?: boolean
  stil?: React.CSSProperties
}> = ({ x, y, w = 360, h, titel, unter, farbe = farben.rand, ab, bis, symbol, gestrichelt, leuchten = 0, monoUnter, stil }) => (
  <Erscheinen
    ab={ab}
    bis={bis}
    art="skalieren"
    style={{ position: 'absolute', left: x - w / 2, top: h ? y - h / 2 : undefined, width: w, height: h, ...(h ? {} : { top: y, transform: 'translateY(-50%)' }) }}
  >
    <div
      style={{
        width: '100%',
        height: h ? '100%' : undefined,
        boxSizing: 'border-box',
        background: farben.flaeche,
        border: `4px ${gestrichelt ? 'dashed' : 'solid'} ${farbe}`,
        borderRadius: 24,
        padding: '22px 26px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        boxShadow: leuchten > 0 ? `0 0 ${50 * leuchten}px ${farbe}` : '0 10px 30px rgba(0,0,0,0.35)',
        ...stil,
      }}
    >
      {symbol && <div style={{ flexShrink: 0, display: 'flex' }}>{symbol}</div>}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: schriften.text, fontWeight: 750, fontSize: 40, color: farben.text, lineHeight: 1.15 }}>{titel}</div>
        {unter && (
          <div
            style={{
              fontFamily: monoUnter ? schriften.mono : schriften.text,
              fontSize: monoUnter ? 27 : 29,
              color: farben.gedaempft,
              marginTop: 6,
              lineHeight: 1.25,
            }}
          >
            {unter}
          </div>
        )}
      </div>
    </div>
  </Erscheinen>
)

type Punkt = [number, number]

const quadratisch = (a: Punkt, k: Punkt, b: Punkt, s: number): Punkt => [
  (1 - s) ** 2 * a[0] + 2 * (1 - s) * s * k[0] + s ** 2 * b[0],
  (1 - s) ** 2 * a[1] + 2 * (1 - s) * s * k[1] + s ** 2 * b[1],
]

const pfadLaenge = (a: Punkt, k: Punkt, b: Punkt) => {
  let laenge = 0
  let vorher = a
  for (let i = 1; i <= 40; i++) {
    const p = quadratisch(a, k, b, i / 40)
    laenge += Math.hypot(p[0] - vorher[0], p[1] - vorher[1])
    vorher = p
  }
  return laenge
}

/** Verbindung, die sich zeichnet. `via` biegt sie über einen Kontrollpunkt. */
export const Linie: React.FC<{
  von: Punkt
  nach: Punkt
  via?: Punkt
  farbe: string
  ab: number
  dauer?: number
  breite?: number
  gestrichelt?: boolean
  pfeil?: boolean
  bis?: number
  beschriftung?: string
  beschriftungVersatz?: Punkt
}> = ({ von, nach, via, farbe, ab, dauer = 18, breite = 7, gestrichelt, pfeil = true, bis, beschriftung, beschriftungVersatz = [0, -34] }) => {
  const { bild } = useSzene()
  const kontroll: Punkt = via ?? [(von[0] + nach[0]) / 2, (von[1] + nach[1]) / 2]
  const laenge = pfadLaenge(von, kontroll, nach)
  const anteil = interpolate(bild, [ab, ab + dauer], [0, 1], { ...klemmen, easing: Easing.inOut(Easing.cubic) })
  const aus = bis === undefined ? 1 : 1 - einblenden(bild, bis, 10)
  if (anteil <= 0) return null
  const d = `M ${von[0]} ${von[1]} Q ${kontroll[0]} ${kontroll[1]} ${nach[0]} ${nach[1]}`
  const spitze = quadratisch(von, kontroll, nach, anteil)
  const davor = quadratisch(von, kontroll, nach, Math.max(0, anteil - 0.01))
  const winkel = (Math.atan2(spitze[1] - davor[1], spitze[0] - davor[0]) * 180) / Math.PI
  const mitte = quadratisch(von, kontroll, nach, 0.5)
  const maskId = `m-${von.join('-')}-${nach.join('-')}-${ab}`
  return (
    <svg style={{ position: 'absolute', inset: 0, opacity: aus, overflow: 'visible' }} width={1920} height={1080}>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <path d={d} stroke="white" strokeWidth={breite + 6} fill="none" strokeDasharray={laenge} strokeDashoffset={laenge * (1 - anteil)} />
        </mask>
      </defs>
      <path
        d={d}
        stroke={farbe}
        strokeWidth={breite}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={gestrichelt ? '18 16' : undefined}
        mask={`url(#${maskId})`}
      />
      {pfeil && (
        <polygon points="-8,-13 16,0 -8,13" fill={farbe} transform={`translate(${spitze[0]} ${spitze[1]}) rotate(${winkel})`} />
      )}
      {beschriftung && (
        <text
          x={mitte[0] + beschriftungVersatz[0]}
          y={mitte[1] + beschriftungVersatz[1]}
          fill={farbe}
          fontFamily={schriften.mono}
          fontWeight={700}
          fontSize={28}
          textAnchor="middle"
          opacity={einblenden(bild, ab + dauer * 0.6, 10)}
          style={{ paintOrder: 'stroke', stroke: farben.grund, strokeWidth: 10 }}
        >
          {beschriftung}
        </text>
      )}
    </svg>
  )
}

/** Ein Päckchen (Token, Anfrage …), das von A nach B wandert */
export const Paket: React.FC<{
  von: Punkt
  nach: Punkt
  ab: number
  dauer?: number
  halten?: number
  farbe: string
  children: React.ReactNode
}> = ({ von, nach, ab, dauer = 24, halten = 30, farbe, children }) => {
  const { bild } = useSzene()
  if (bild < ab || bild > ab + dauer + halten + 10) return null
  const s = interpolate(bild, [ab, ab + dauer], [0, 1], { ...klemmen, easing: Easing.inOut(Easing.cubic) })
  const deckkraft = einblenden(bild, ab, 6) * (1 - einblenden(bild, ab + dauer + halten, 10))
  return (
    <div
      style={{
        position: 'absolute',
        left: von[0] + (nach[0] - von[0]) * s,
        top: von[1] + (nach[1] - von[1]) * s,
        transform: 'translate(-50%, -50%)',
        opacity: deckkraft,
        background: farbe,
        color: farben.grund,
        fontFamily: schriften.mono,
        fontWeight: 700,
        fontSize: 28,
        padding: '10px 20px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        boxShadow: `0 0 30px ${farbe}`,
      }}
    >
      {children}
    </div>
  )
}

/** Schräger Stempel für die Kernaussage einer Szene */
export const Stempel: React.FC<{ x: number; y: number; farbe: string; ab: number; drehung?: number; children: React.ReactNode }> = ({
  x,
  y,
  farbe,
  ab,
  drehung = -6,
  children,
}) => {
  const { bild, fps } = useSzene()
  const f = feder(bild, ab, fps)
  if (bild < ab) return null
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${drehung}deg) scale(${2.2 - 1.2 * f})`,
        opacity: Math.min(1, f * 1.5),
        border: `6px solid ${farbe}`,
        color: farbe,
        borderRadius: 18,
        padding: '14px 30px',
        fontFamily: schriften.text,
        fontWeight: 850,
        fontSize: 50,
        letterSpacing: 1,
        whiteSpace: 'nowrap',
        background: 'rgba(13,19,36,0.88)',
      }}
    >
      {children}
    </div>
  )
}

/** Terminalfenster, dessen Zeilen sich nacheinander tippen */
export const Terminal: React.FC<{
  x: number
  y: number
  w: number
  h: number
  titel: string
  ab: number
  farbe?: string
  zeilen: { text: string; ab: number; farbe?: string; tippen?: boolean }[]
  schrift?: number
}> = ({ x, y, w, h, titel, ab, farbe = farben.rand, zeilen, schrift = 30 }) => {
  const { bild } = useSzene()
  return (
    <Erscheinen ab={ab} art="skalieren" style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#090e1b',
          border: `3px solid ${farbe}`,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 18px',
            background: farben.flaeche,
            borderBottom: `2px solid ${farben.rand}`,
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((punkt) => (
            <div key={punkt} style={{ width: 16, height: 16, borderRadius: 8, background: punkt }} />
          ))}
          <div style={{ marginLeft: 12, fontFamily: schriften.mono, fontSize: 24, color: farben.gedaempft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {titel}
          </div>
        </div>
        <div style={{ padding: '18px 24px', fontFamily: schriften.mono, fontSize: schrift, lineHeight: 1.5 }}>
          {zeilen.map((zeile) => {
            if (bild < zeile.ab) return null
            const zeichen = zeile.tippen === false ? zeile.text.length : Math.floor((bild - zeile.ab) * 1.6)
            const sichtbar = zeile.text.slice(0, zeichen)
            const tippt = zeichen < zeile.text.length
            return (
              <div key={`${zeile.ab}-${zeile.text}`} style={{ color: zeile.farbe ?? farben.text, whiteSpace: 'pre' }}>
                {sichtbar}
                {tippt && <span style={{ background: farben.text, color: farben.text }}>▌</span>}
              </div>
            )
          })}
        </div>
      </div>
    </Erscheinen>
  )
}

/** Große Textzeile, z. B. eine Zwischenüberschrift im Bild */
export const Aussage: React.FC<{
  x: number
  y: number
  ab: number
  bis?: number
  farbe?: string
  groesse?: number
  breite?: number
  ausrichtung?: 'left' | 'center'
  children: React.ReactNode
}> = ({ x, y, ab, bis, farbe = farben.text, groesse = 46, breite = 900, ausrichtung = 'center', children }) => (
  <Erscheinen
    ab={ab}
    bis={bis}
    style={{
      position: 'absolute',
      left: ausrichtung === 'center' ? x - breite / 2 : x,
      top: y,
      width: breite,
      textAlign: ausrichtung,
      fontFamily: schriften.text,
      fontWeight: 700,
      fontSize: groesse,
      lineHeight: 1.2,
      color: farbe,
    }}
  >
    {children}
  </Erscheinen>
)
