import type React from 'react'
import { Erscheinen, einblenden, Stempel, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Drohne, Haken, Kreuz, Wolke } from '../symbole'

const spalteLinks = 440
const spalteRechts = 1180
const breite = 660

export const Szene11Codespaces: React.FC = () => {
  const { bild, t, bei } = useSzene()
  const drohneAb = bei({ de: 'Eine Drohne ist', en: 'A drone is' })
  const zeilen = [
    {
      ab: bei({ de: 'Per SSH', en: 'SSH in' }),
      thema: 'SSH',
      links: { de: 'nur durch einen Tunnel', en: 'only through a tunnel' },
      rechts: { de: 'ganz normales ssh', en: 'plain ssh' },
    },
    {
      ab: bei({ de: 'Terminal von VS Code', en: 'VS Code terminal' }),
      thema: 'Terminal',
      links: {
        de: 'VS-Code-Terminal, Darstellungsfehler',
        en: 'VS Code terminal, rendering glitches',
      },
      rechts: {
        de: 'zellij im echten Terminal',
        en: 'zellij in a real terminal',
      },
    },
    {
      ab: bei({ de: 'bei jedem Abbruch', en: 'whenever the connection' }),
      thema: { de: 'Abbruch', en: 'Drop' },
      links: { de: 'Sitzung weg', en: 'session gone' },
      rechts: { de: 'Sitzung überlebt', en: 'session survives' },
    },
    {
      ab: bei({ de: 'dreißig Minuten', en: 'thirty minutes' }),
      thema: { de: 'Leerlauf', en: 'Idle' },
      links: { de: 'nach 30 min angehalten', en: 'stopped after 30 min' },
      rechts: { de: 'angehalten wird nichts', en: 'nothing gets stopped' },
    },
  ]
  return (
    <>
      {/* Spaltenköpfe */}
      <Erscheinen
        ab={4}
        style={{
          position: 'absolute',
          left: spalteLinks,
          top: 190,
          width: breite,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontFamily: schriften.text,
            fontSize: 44,
            fontWeight: 800,
            color: farben.gedaempft,
          }}
        >
          <Wolke farbe={farben.gedaempft} groesse={60} />
          GitHub Codespaces
        </div>
      </Erscheinen>
      <Erscheinen
        ab={drohneAb - 30}
        style={{
          position: 'absolute',
          left: spalteRechts,
          top: 190,
          width: breite,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontFamily: schriften.text,
            fontSize: 44,
            fontWeight: 800,
            color: farben.agent,
          }}
        >
          <Drohne farbe={farben.agent} groesse={60} />
          {t({ de: 'Drohne', en: 'Drone' })}
        </div>
      </Erscheinen>

      {zeilen.map((zeile, index) => {
        const y = 300 + index * 150
        const rechtsAb = drohneAb + index * 8
        return (
          <div key={zeile.links.en}>
            <Erscheinen
              ab={zeile.ab}
              style={{
                position: 'absolute',
                left: 80,
                top: y + 26,
                width: 330,
              }}
            >
              <div
                style={{
                  fontFamily: schriften.mono,
                  fontSize: 32,
                  fontWeight: 700,
                  color: farben.gedaempft,
                }}
              >
                {typeof zeile.thema === 'string' ? zeile.thema : t(zeile.thema)}
              </div>
            </Erscheinen>
            <Erscheinen
              ab={zeile.ab}
              style={{
                position: 'absolute',
                left: spalteLinks,
                top: y,
                width: breite,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  background: farben.flaeche,
                  border: `3px solid ${farben.fehler}`,
                  borderRadius: 20,
                  padding: '18px 24px',
                  fontFamily: schriften.text,
                  fontSize: 34,
                  color: farben.text,
                }}
              >
                <Kreuz farbe={farben.fehler} groesse={44} />
                {t(zeile.links)}
              </div>
            </Erscheinen>
            <Erscheinen
              ab={rechtsAb}
              style={{
                position: 'absolute',
                left: spalteRechts,
                top: y,
                width: breite,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  background: farben.flaeche,
                  border: `3px solid ${farben.deploy}`,
                  borderRadius: 20,
                  padding: '18px 24px',
                  fontFamily: schriften.text,
                  fontSize: 34,
                  color: farben.text,
                  boxShadow: `0 0 ${24 * einblenden(bild, rechtsAb, 16)}px ${farben.deploy}44`,
                }}
              >
                <Haken farbe={farben.deploy} groesse={44} />
                {t(zeile.rechts)}
              </div>
            </Erscheinen>
          </div>
        )
      })}
      <Stempel
        x={spalteLinks + breite / 2}
        y={935}
        farbe={farben.fehler}
        ab={bei({ de: 'nutzlos', en: 'useless' })}
      >
        {t({
          de: 'für Agenten nutzlos',
          en: 'useless for agents',
        })}
      </Stempel>
    </>
  )
}
