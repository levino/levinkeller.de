import type React from 'react'
import { interpolate } from 'remotion'
import {
  Aussage,
  Erscheinen,
  einblenden,
  feder,
  Linie,
  useSzene,
} from '../bausteine'
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

export const Szene2Server: React.FC = () => {
  const { bild, fps, t, bei } = useSzene()
  const serverAb = bei({ de: 'Alles läuft', en: 'Everything runs' })
  const ramAb = bei({ de: 'zweiundsechzig', en: 'sixty-two' })
  const speicherAb = bei({ de: 'Agenten brauchen', en: 'Agents need' })
  const laptopAb = bei({ de: 'Der Laptop', en: 'So the laptop' })
  const deckelAb = bei({ de: 'wenn der Deckel', en: 'when the lid' })
  const deckel = feder(bild, deckelAb, fps)
  const puls = 0.75 + 0.25 * Math.sin(bild / 6)
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
                  de: 'Bare Metal, gebraucht',
                  en: 'bare metal, second-hand',
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
                      opacity: f * (bild > deckelAb ? puls : 1),
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
                opacity: einblenden(bild, speicherAb + 20),
              }}
            >
              {t({
                de: 'Speicher ist knapp, nicht Rechenzeit',
                en: 'Memory is the scarce resource, not CPU',
              })}
            </div>
          </div>
        </div>
      </Erscheinen>

      {/* Laptop */}
      <Erscheinen
        ab={laptopAb - 12}
        art="skalieren"
        style={{ position: 'absolute', left: 110, top: 330, width: 620 }}
      >
        <div style={{ position: 'relative', height: 360 }}>
          <div
            style={{
              position: 'absolute',
              left: 50,
              right: 50,
              bottom: 0,
              height: 340,
              transform: `scaleY(${interpolate(deckel, [0, 1], [1, 0.04])})`,
              transformOrigin: 'bottom',
              background: '#090e1b',
              border: `6px solid ${farben.gedaempft}`,
              borderRadius: '18px 18px 4px 4px',
              padding: 24,
              boxSizing: 'border-box',
              fontFamily: schriften.mono,
              fontSize: 28,
              color: farben.text,
            }}
          >
            <div style={{ color: farben.mensch }}>$ ssh hatchery-…</div>
            <div style={{ color: farben.gedaempft, marginTop: 8 }}>
              zellij attach
            </div>
          </div>
        </div>
        <div
          style={{
            height: 22,
            background: farben.gedaempft,
            borderRadius: '0 0 16px 16px',
          }}
        />
      </Erscheinen>
      <Aussage x={420} y={760} ab={laptopAb} breite={640} groesse={40}>
        {t({
          de: 'Laptop: nur ein Terminal mit gutem Bildschirm',
          en: 'Laptop: just a terminal with a nice screen',
        })}
      </Aussage>
      <Linie
        von={[700, 520]}
        nach={[890, 520]}
        farbe={farben.mensch}
        ab={laptopAb + 10}
        beschriftung="ssh"
      />
      <Aussage
        x={420}
        y={900}
        ab={deckelAb + 6}
        breite={700}
        groesse={38}
        farbe={farben.agent}
      >
        {t({
          de: 'Deckel zu – die Agenten arbeiten weiter',
          en: 'Lid closed – the agents keep working',
        })}
      </Aussage>
    </>
  )
}
