import type React from 'react'
import {
  Aussage,
  Erscheinen,
  einblenden,
  Linie,
  Terminal,
  useSzene,
} from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Mikrofon } from '../symbole'

const diktat = {
  de: [
    '> Die Doku braucht eine Suche.',
    '  Sie soll über alle Sprachen',
    '  gehen, Treffer im Text',
    '  markieren und auch auf dem',
    '  Handy gut bedienbar sein …',
  ],
  en: [
    '> The docs need a search.',
    '  It should cover every',
    '  language, highlight matches',
    '  in the text and work well',
    '  on a phone, too …',
  ],
}

export const Szene05Sprechen: React.FC = () => {
  const { bild, sprache, t, bei } = useSzene()
  const sprechAb = bei({ de: 'Ich spreche', en: 'I talk' })
  const whisperingAb = bei('Whispering')
  const minutenAb = bei({ de: 'zwei Minuten', en: 'two minutes' })
  const schnellerAb = bei({ de: 'schneller als', en: 'faster than' })
  const kontextAb = bei({ de: 'mehr Kontext', en: 'more context' })
  const spricht = bild >= sprechAb
  return (
    <>
      {/* Tippen, durchgestrichen */}
      <Erscheinen
        ab={4}
        style={{ position: 'absolute', left: 120, top: 220, width: 560 }}
      >
        <div
          style={{
            fontFamily: schriften.text,
            fontSize: 44,
            fontWeight: 800,
            color: farben.gedaempft,
            textDecoration: spricht ? 'line-through' : 'none',
            textDecorationColor: farben.fehler,
            textDecorationThickness: 6,
          }}
        >
          ⌨ {t({ de: 'tippen', en: 'typing' })}
        </div>
      </Erscheinen>

      {/* Mikrofon mit Wellenform */}
      <Erscheinen
        ab={sprechAb}
        art="skalieren"
        style={{ position: 'absolute', left: 120, top: 330, width: 560 }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: 110,
              border: `6px solid ${farben.mensch}`,
              background: farben.flaeche,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${30 + 20 * Math.sin(bild / 4) ** 2}px ${farben.mensch}`,
            }}
          >
            <Mikrofon farbe={farben.mensch} groesse={130} />
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              height: 110,
            }}
          >
            {Array.from({ length: 22 }, (_, index) => index).map((index) => {
              const hoehe =
                14 +
                90 *
                  Math.abs(
                    Math.sin(bild / 3.1 + index * 0.9) *
                      Math.cos(bild / 7 + index * 0.4)
                  )
              return (
                <div
                  key={index}
                  style={{
                    width: 12,
                    height: hoehe,
                    borderRadius: 6,
                    background: farben.mensch,
                  }}
                />
              )
            })}
          </div>
        </div>
      </Erscheinen>
      <Aussage
        x={400}
        y={760}
        ab={whisperingAb}
        breite={640}
        groesse={42}
        farbe={farben.text}
      >
        Whispering
        <div
          style={{
            fontSize: 30,
            color: farben.gedaempft,
            fontWeight: 500,
            marginTop: 8,
          }}
        >
          {t({
            de: 'Open Source · Speech-to-Text',
            en: 'open source · speech-to-text',
          })}
        </div>
      </Aussage>

      <Linie
        von={[700, 520]}
        nach={[880, 520]}
        farbe={farben.mensch}
        ab={whisperingAb + 6}
        breite={8}
      />

      {/* Text landet im Prompt des Agenten */}
      <Terminal
        x={900}
        y={250}
        w={940}
        h={420}
        titel="claude · hatchery-levino-levinkeller-de"
        ab={whisperingAb}
        farbe={farben.agent}
        schrift={32}
        zeilen={diktat[sprache].map((text, index) => ({
          text,
          ab: whisperingAb + 14 + index * 24,
          farbe: index === 0 ? farben.mensch : farben.text,
        }))}
      />
      <div
        style={{
          position: 'absolute',
          left: 900,
          top: 710,
          width: 940,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          fontFamily: schriften.text,
          fontSize: 38,
          fontWeight: 700,
        }}
      >
        {[
          {
            ab: minutenAb,
            text: {
              de: '2 Minuten erklären statt tippen',
              en: '2 minutes of explaining, not typing',
            },
            farbe: farben.text,
          },
          {
            ab: schnellerAb,
            text: { de: '→ schneller', en: '→ faster' },
            farbe: farben.deploy,
          },
          {
            ab: kontextAb,
            text: {
              de: '→ genauer, weil mehr Kontext',
              en: '→ more precise: more context',
            },
            farbe: farben.deploy,
          },
        ].map((zeile) => (
          <div
            key={zeile.text.en}
            style={{
              color: zeile.farbe,
              opacity: einblenden(bild, zeile.ab),
            }}
          >
            {t(zeile.text)}
          </div>
        ))}
      </div>
    </>
  )
}
