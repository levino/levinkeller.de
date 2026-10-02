import type React from 'react'
import { Erscheinen, einblenden, feder, Stempel, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Server } from '../symbole'

const drohnen = [
  'shipyard',
  'levinkeller.de',
  'hatchery',
  'dotfiles',
  'devcontainer-t…',
  '…',
]

export const Szene02Mieten: React.FC = () => {
  const { bild, fps, t, bei } = useSzene()
  const mietenAb = bei({ de: 'gemietet', en: 'rented' })
  const serverAb = bei('Hetzner', -14)
  const ramAb = bei({ de: 'zweiundsechzig', en: 'sixty-two' })
  const uhrAb = bei({ de: 'rund um die Uhr', en: 'around the clock' })
  const speicherAb = bei({ de: 'Fünf bis zehn', en: 'Five to ten' })
  const knappAb = bei({ de: 'knapp wird', en: 'what runs out' })
  const puls = bild > uhrAb ? 0.8 + 0.2 * Math.sin(bild / 6) : 1
  const fakten = [
    {
      ab: bei('Hetzner'),
      zeichen: '↺',
      text: {
        de: 'gebraucht, Hetzner-Serverbörse',
        en: 'second-hand, Hetzner auction',
      },
    },
    { ab: ramAb, zeichen: 'GB', text: { de: '62 GB RAM', en: '62 GB of RAM' } },
    {
      ab: uhrAb,
      zeichen: '24h',
      text: { de: 'läuft rund um die Uhr', en: 'runs around the clock' },
    },
    {
      ab: bei({ de: 'zweistelligen', en: 'two-digit' }),
      zeichen: '€',
      text: {
        de: 'zweistelliger Eurobetrag / Monat',
        en: 'two-digit euros a month',
      },
    },
  ]
  return (
    <>
      {/* Server */}
      <Erscheinen
        ab={serverAb}
        art="skalieren"
        style={{
          position: 'absolute',
          left: 900,
          top: 210,
          width: 940,
          height: 760,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            background: farben.flaeche,
            border: `4px solid ${farben.rand}`,
            borderRadius: 28,
            padding: 40,
            fontFamily: schriften.text,
            color: farben.text,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Server farbe={farben.text} groesse={70} />
            <div>
              <div style={{ fontSize: 48, fontWeight: 800 }}>
                {t({ de: 'Dev-Server', en: 'Dev server' })}
              </div>
              <div style={{ fontSize: 30, color: farben.gedaempft }}>
                {t({
                  de: 'Bare Metal, gemietet',
                  en: 'bare metal, rented',
                })}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 44, opacity: einblenden(bild, ramAb - 20) }}>
            <div
              style={{
                fontSize: 32,
                color: farben.gedaempft,
                fontFamily: schriften.mono,
              }}
            >
              {t({
                de: 'CPU · älterer Vierkerner',
                en: 'CPU · older quad-core',
              })}
            </div>
            <div
              style={{
                height: 26,
                background: farben.grund,
                borderRadius: 13,
                marginTop: 12,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${18 + 8 * Math.sin(bild / 9) ** 2}%`,
                  height: '100%',
                  background: farben.gedaempft,
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 40, opacity: einblenden(bild, ramAb) }}>
            <div
              style={{
                fontSize: 32,
                fontFamily: schriften.mono,
                color: farben.text,
              }}
            >
              RAM · 62 GB
            </div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                height: 230,
                background: farben.grund,
                borderRadius: 16,
                marginTop: 12,
                padding: 10,
              }}
            >
              {drohnen.map((name, index) => {
                const f = feder(bild, speicherAb + index * 7, fps)
                return (
                  <div
                    key={name}
                    style={{
                      flex: index === drohnen.length - 1 ? 0.6 : 1,
                      transform: `scaleY(${f})`,
                      transformOrigin: 'bottom',
                      background: farben.agent,
                      opacity: f * puls,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        fontFamily: schriften.mono,
                        fontSize: 22,
                        fontWeight: 700,
                        color: farben.grund,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {name}
                    </div>
                  </div>
                )
              })}
            </div>
            <div
              style={{
                fontSize: 30,
                color: farben.agent,
                marginTop: 16,
                opacity: einblenden(bild, knappAb),
              }}
            >
              {t({
                de: 'Knapp wird der Speicher, nicht die Rechenzeit',
                en: 'Memory runs out, not CPU',
              })}
            </div>
          </div>
        </div>
      </Erscheinen>

      {/* Mieten statt kaufen */}
      <Stempel x={430} y={250} farbe={farben.deploy} ab={mietenAb} drehung={-4}>
        {t({ de: 'Mieten statt kaufen', en: 'Rent, don’t buy' })}
      </Stempel>
      {fakten.map((fakt, index) => (
        <Erscheinen
          key={fakt.text.en}
          ab={fakt.ab}
          style={{
            position: 'absolute',
            left: 90,
            top: 380 + index * 140,
            width: 720,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              background: farben.flaeche,
              border: `3px solid ${farben.rand}`,
              borderRadius: 20,
              padding: '18px 26px',
              fontFamily: schriften.text,
              fontSize: 38,
              fontWeight: 700,
              color: farben.text,
            }}
          >
            <span
              style={{
                fontFamily: schriften.mono,
                color: farben.deploy,
                minWidth: 60,
                textAlign: 'center',
              }}
            >
              {fakt.zeichen}
            </span>
            {t(fakt.text)}
          </div>
        </Erscheinen>
      ))}
    </>
  )
}
