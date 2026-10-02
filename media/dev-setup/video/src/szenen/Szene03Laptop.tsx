import type React from 'react'
import { interpolate } from 'remotion'
import {
  Aussage,
  Erscheinen,
  einblenden,
  feder,
  type Text,
  useSzene,
} from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Kreuz, Server, Thermometer } from '../symbole'

const klemmen = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

/** Balken mit Beschriftung: Temperatur, Lüfter, Akku */
const Anzeige: React.FC<{
  titel: Text
  wert: number
  farbe: string
  text: string
  symbol?: React.ReactNode
}> = ({ titel, wert, farbe, text, symbol }) => {
  const { t } = useSzene()
  return (
    <div style={{ marginTop: 18 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: 'space-between',
          fontFamily: schriften.text,
          fontSize: 30,
          color: farben.gedaempft,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {symbol}
          {t(titel)}
        </span>
        <span
          style={{ fontFamily: schriften.mono, color: farbe, fontWeight: 700 }}
        >
          {text}
        </span>
      </div>
      <div
        style={{
          height: 22,
          background: farben.grund,
          borderRadius: 11,
          marginTop: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.round(wert * 100)}%`,
            height: '100%',
            background: farbe,
            borderRadius: 11,
          }}
        />
      </div>
    </div>
  )
}

/** Lüfterrad, das sich mit `tempo` Umdrehungen pro Sekunde dreht */
const Luefter: React.FC<{ drehung: number; farbe: string }> = ({
  drehung,
  farbe,
}) => (
  <svg aria-hidden="true" width={40} height={40} viewBox="-12 -12 24 24">
    <g transform={`rotate(${drehung})`} fill={farbe}>
      {[0, 90, 180, 270].map((winkel) => (
        <path
          key={winkel}
          d="M0 0 C 2 -3, 7 -6, 3 -10 C 0 -9, -1 -4, 0 0 Z"
          transform={`rotate(${winkel})`}
        />
      ))}
    </g>
    <circle r={11} fill="none" stroke={farbe} strokeWidth={1.5} />
  </svg>
)

const panel: React.CSSProperties = {
  position: 'absolute',
  top: 170,
  width: 830,
  height: 700,
  boxSizing: 'border-box',
  background: farben.flaeche,
  borderRadius: 28,
  padding: '30px 38px',
  fontFamily: schriften.text,
  color: farben.text,
}

export const Szene03Laptop: React.FC = () => {
  const { bild, fps, t, bei } = useSzene()
  const fettAb = bei({ de: 'Die Alternative', en: 'The alternative' })
  const preisAb = bei({ de: 'mehrere tausend', en: 'several thousand' })
  const akkuAb = bei({ de: 'nur einen Akku', en: 'only one battery' })
  const npmAb = bei('npm install', -10)
  const leerAb = bei({ de: 'laut, heiß', en: 'loud, hot' })
  const neoAb = bei('MacBook Neo', -6)
  const kuehlAb = bei({ de: 'bleibt kühl', en: 'stays cool' })
  const woandersAb = bei({ de: 'woanders', en: 'elsewhere' })
  const deckelAb = bei({ de: 'klappe ich', en: 'close the lid' })

  // Links: unter Last steigen Temperatur und Lüfter, der Akku fällt
  const last = interpolate(bild, [npmAb, leerAb + 20], [0, 1], klemmen)
  const lueftung = interpolate(last, [0, 1], [2, 30])
  const drehungLinks = bild * lueftung
  const deckel = feder(bild, deckelAb, fps)
  const puls = 0.6 + 0.4 * Math.sin(bild / 5) ** 2

  return (
    <>
      {/* Der fette Laptop */}
      <Erscheinen
        ab={fettAb}
        art="skalieren"
        style={{ ...panel, left: 80, border: `4px solid ${farben.fehler}` }}
      >
        <div style={{ fontSize: 46, fontWeight: 800 }}>
          {t({ de: 'Laptop mit 64 GB', en: 'Laptop with 64 GB' })}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginTop: 16,
            fontSize: 30,
            flexWrap: 'wrap',
          }}
        >
          {[
            {
              ab: preisAb,
              text: { de: 'mehrere tausend €', en: 'several thousand €' },
            },
            {
              ab: preisAb + 20,
              text: {
                de: 'in ein paar Jahren veraltet',
                en: 'outdated in a few years',
              },
            },
            {
              ab: akkuAb,
              text: { de: '1 Akku · 1 Lüfter', en: '1 battery · 1 fan' },
            },
          ].map((chip) => (
            <div
              key={chip.text.en}
              style={{
                opacity: einblenden(bild, chip.ab),
                border: `3px solid ${farben.rand}`,
                borderRadius: 999,
                padding: '6px 18px',
                color: farben.text,
              }}
            >
              {t(chip.text)}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 22,
            height: 128,
            background: '#090e1b',
            borderRadius: 14,
            padding: '10px 18px',
            fontFamily: schriften.mono,
            fontSize: 26,
            lineHeight: 1.4,
            overflow: 'hidden',
            opacity: einblenden(bild, npmAb),
          }}
        >
          {Array.from({ length: 10 }, (_, index) => index)
            .filter((index) => bild > npmAb + index * 5)
            .slice(-3)
            .map((index) => (
              <div key={index} style={{ color: farben.text }}>
                <span style={{ color: farben.agent }}>agent-{index + 1}</span> $
                npm install
              </div>
            ))}
        </div>
        <Anzeige
          titel={{ de: 'Temperatur', en: 'Temperature' }}
          symbol={<Thermometer farbe={farben.gedaempft} groesse={32} />}
          wert={0.3 + 0.65 * last}
          farbe={last > 0.5 ? farben.fehler : farben.mensch}
          text={`${Math.round(45 + 50 * last)} °C`}
        />
        <Anzeige
          titel={{ de: 'Lüfter', en: 'Fan' }}
          symbol={
            <Luefter
              drehung={drehungLinks}
              farbe={last > 0.5 ? farben.fehler : farben.gedaempft}
            />
          }
          wert={0.15 + 0.85 * last}
          farbe={last > 0.5 ? farben.fehler : farben.mensch}
          text={last > 0.6 ? t({ de: 'laut', en: 'loud' }) : '…'}
        />
        <Anzeige
          titel={{ de: 'Akku', en: 'Battery' }}
          wert={1 - 0.9 * last}
          farbe={last > 0.6 ? farben.fehler : farben.deploy}
          text={`${Math.round(100 - 90 * last)} %`}
        />
      </Erscheinen>
      <Erscheinen
        ab={leerAb + 10}
        art="skalieren"
        style={{ position: 'absolute', left: 700, top: 186 }}
      >
        <Kreuz farbe={farben.fehler} groesse={110} />
      </Erscheinen>

      {/* Der leichte Laptop */}
      <Erscheinen
        ab={neoAb}
        art="skalieren"
        style={{ ...panel, left: 1010, border: `4px solid ${farben.deploy}` }}
      >
        <div style={{ fontSize: 46, fontWeight: 800 }}>MacBook Neo</div>
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginTop: 16,
            fontSize: 30,
            flexWrap: 'wrap',
          }}
        >
          {[
            { de: 'leicht', en: 'light' },
            { de: 'lange Akkulaufzeit', en: 'long battery life' },
            { de: 'schönes Display', en: 'great display' },
          ].map((chip, index) => (
            <div
              key={chip.en}
              style={{
                opacity: einblenden(bild, neoAb + 12 + index * 10),
                border: `3px solid ${farben.deploy}`,
                color: farben.deploy,
                borderRadius: 999,
                padding: '6px 18px',
              }}
            >
              {t(chip)}
            </div>
          ))}
        </div>
        {/* Laptop-Bild, dessen Deckel sich schließt */}
        <div
          style={{
            position: 'relative',
            height: 250,
            marginTop: 26,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: 400,
              height: 230,
              transform: `scaleY(${interpolate(deckel, [0, 1], [1, 0.05])})`,
              transformOrigin: 'bottom',
              background: '#090e1b',
              border: `6px solid ${farben.gedaempft}`,
              borderRadius: '16px 16px 4px 4px',
              boxSizing: 'border-box',
              padding: 18,
              fontFamily: schriften.mono,
              fontSize: 26,
              color: farben.text,
            }}
          >
            <div style={{ color: farben.mensch }}>$ ssh hatchery-…</div>
            <div style={{ color: farben.gedaempft, marginTop: 6 }}>
              zellij attach
            </div>
          </div>
          <div
            style={{
              width: 480,
              height: 18,
              background: farben.gedaempft,
              borderRadius: '0 0 14px 14px',
            }}
          />
        </div>
        <Anzeige
          titel={{ de: 'Temperatur', en: 'Temperature' }}
          symbol={<Thermometer farbe={farben.gedaempft} groesse={32} />}
          wert={0.25}
          farbe={farben.deploy}
          text={t({ de: 'kühl', en: 'cool' })}
        />
        <Anzeige
          titel={{ de: 'Akku', en: 'Battery' }}
          wert={0.92}
          farbe={farben.deploy}
          text="92 %"
        />
      </Erscheinen>
      <Erscheinen
        ab={kuehlAb}
        style={{
          position: 'absolute',
          left: 1010,
          top: 886,
          width: 830,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: schriften.mono,
            fontSize: 30,
            color: farben.text,
            border: `3px solid ${farben.rand}`,
            borderRadius: 14,
            padding: '8px 18px',
            background: farben.flaeche,
          }}
        >
          npm install
        </div>
        <div
          style={{
            fontSize: 44,
            color: farben.agent,
            opacity: einblenden(bild, woandersAb),
          }}
        >
          →
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: einblenden(bild, woandersAb),
            fontFamily: schriften.text,
            fontSize: 34,
            fontWeight: 700,
            color: farben.agent,
          }}
        >
          <Server farbe={farben.agent} groesse={50} />
          {t({ de: 'läuft auf dem Server', en: 'runs on the server' })}
        </div>
      </Erscheinen>
      <Aussage
        x={1425}
        y={960}
        ab={deckelAb + 8}
        breite={830}
        groesse={38}
        farbe={farben.agent}
      >
        <span style={{ opacity: puls }}>●</span>{' '}
        {t({
          de: 'Deckel zu – die Agenten arbeiten weiter',
          en: 'Lid closed – the agents keep working',
        })}
      </Aussage>
      <Aussage
        x={495}
        y={890}
        ab={leerAb}
        breite={830}
        groesse={44}
        farbe={farben.fehler}
      >
        {t({ de: 'laut · heiß · leer', en: 'loud · hot · drained' })}
      </Aussage>
    </>
  )
}
