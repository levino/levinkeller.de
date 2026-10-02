import type React from 'react'
import { Aussage, Erscheinen, Terminal, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'

export const Szene09Arbeitsplatz: React.FC = () => {
  const { bild, t, bei } = useSzene()
  const zellijAb = bei('zellij', -10)
  const agentenAb = bei({ de: 'mehrere Agenten', en: 'several agents' })
  const abrissAb = bei({ de: 'abreißt', en: 'connection drops' })
  const tunnelAb = bei({ de: 'Tunnel', en: 'tunnel' })
  const wiederAb = bei({ de: 'nächsten Verbinden', en: 'next time I connect' })
  const kollegenAb = bei({
    de: 'wie zwischen Kollegen',
    en: 'between colleagues',
  })
  const kollegen = [
    {
      tab: 'shipyard',
      ab: bei({ de: 'fertig', en: 'done' }),
      text: { de: 'ist fertig', en: 'is done' },
      zeichen: '✓',
      farbe: farben.deploy,
    },
    {
      tab: 'levinkeller.de',
      ab: bei({ de: 'eine Frage', en: 'a question' }),
      text: { de: 'hat eine Frage', en: 'has a question' },
      zeichen: '?',
      farbe: farben.mensch,
    },
    {
      tab: 'hatchery',
      ab: bei({ de: 'Entscheidung', en: 'decision' }),
      text: { de: 'braucht eine Entscheidung', en: 'needs a decision' },
      zeichen: '!',
      farbe: farben.handy,
    },
  ]
  // Verbindung: steht, reißt ab, kommt wieder
  const getrennt = bild >= abrissAb && bild < wiederAb
  const verbindungsFarbe = getrennt ? farben.fehler : farben.deploy
  const aktiverTab = Math.max(
    0,
    ...kollegen.map((kollege, index) => (bild >= kollege.ab ? index : 0))
  )
  const panes = [
    {
      x: 80,
      y: 250,
      w: 620,
      h: 640,
      ab: agentenAb,
      zeilen: [
        '> fix the flaky test',
        '● Read tests/e2e.spec.ts',
        '● Edit playwright.config',
        '● npm test',
        '✓ 42 passed',
        '● git push',
        '● gh pr create',
      ],
    },
    {
      x: 720,
      y: 250,
      w: 620,
      h: 310,
      ab: agentenAb + 10,
      zeilen: [
        '> write the docs page',
        '● Edit content/docs',
        '● npm run build',
      ],
    },
    {
      x: 720,
      y: 580,
      w: 620,
      h: 310,
      ab: agentenAb + 20,
      zeilen: ['> review PR #42', '● Task: review agent', '✓ 2 findings'],
    },
  ]
  return (
    <>
      <Erscheinen
        ab={zellijAb}
        art="blenden"
        style={{ position: 'absolute', left: 80, top: 180, width: 1260 }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            fontFamily: schriften.mono,
            fontSize: 26,
          }}
        >
          <div
            style={{
              background: farben.deploy,
              color: farben.grund,
              padding: '8px 18px',
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            zellij
          </div>
          {kollegen.map(({ tab }, index) => (
            <div
              key={tab}
              style={{
                background:
                  index === aktiverTab ? farben.flaecheHell : farben.flaeche,
                color: index === aktiverTab ? farben.text : farben.gedaempft,
                padding: '8px 18px',
                borderRadius: 8,
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </Erscheinen>
      {panes.map((pane, index) => (
        <Terminal
          key={pane.x + pane.y}
          x={pane.x}
          y={pane.y}
          w={pane.w}
          h={pane.h}
          titel={`claude ${index + 1}`}
          ab={pane.ab}
          farbe={farben.agent}
          schrift={27}
          zeilen={pane.zeilen.map((text, zeile) => ({
            text,
            ab: pane.ab + 10 + zeile * 20,
            farbe: text.startsWith('>')
              ? farben.mensch
              : text.startsWith('✓')
                ? farben.deploy
                : farben.text,
          }))}
        />
      ))}
      {/* Verbindung Laptop – Drohne */}
      <Erscheinen
        ab={abrissAb - 16}
        style={{ position: 'absolute', left: 1400, top: 250, width: 440 }}
      >
        <div
          style={{
            background: farben.flaeche,
            border: `4px solid ${verbindungsFarbe}`,
            borderRadius: 24,
            padding: '24px 28px',
            fontFamily: schriften.text,
            color: farben.text,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 32,
              fontWeight: 750,
            }}
          >
            <span>Laptop</span>
            <span
              style={{
                fontFamily: schriften.mono,
                color: verbindungsFarbe,
                letterSpacing: getrennt ? 6 : 0,
              }}
            >
              {getrennt ? '─ ╳ ─' : '━━━━'}
            </span>
            <span>{t({ de: 'Drohne', en: 'Drone' })}</span>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 30,
              color: verbindungsFarbe,
              fontWeight: 700,
            }}
          >
            {bild < abrissAb
              ? 'ssh · zellij'
              : getrennt
                ? bild >= tunnelAb
                  ? t({ de: 'Zug im Tunnel …', en: 'train in a tunnel …' })
                  : t({ de: 'Verbindung weg', en: 'connection lost' })
                : t({
                    de: 'wieder da: alles noch da',
                    en: 'back: all still there',
                  })}
          </div>
          <div style={{ marginTop: 8, fontSize: 28, color: farben.gedaempft }}>
            {t({
              de: 'die Agenten arbeiten weiter',
              en: 'the agents keep working',
            })}
          </div>
        </div>
      </Erscheinen>

      {/* Drohnen wie Kollegen */}
      <Aussage
        x={1400}
        y={560}
        ab={kollegenAb}
        ausrichtung="left"
        breite={460}
        groesse={36}
      >
        {t({ de: 'Drohnen wie Kollegen', en: 'Drones like colleagues' })}
      </Aussage>
      {kollegen.map((kollege, index) => (
        <Erscheinen
          key={kollege.tab}
          ab={kollege.ab}
          style={{
            position: 'absolute',
            left: 1400,
            top: 630 + index * 100,
            width: 440,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: farben.flaeche,
              border: `3px solid ${kollege.farbe}`,
              borderRadius: 18,
              padding: '12px 18px',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                background: kollege.farbe,
                color: farben.grund,
                fontFamily: schriften.mono,
                fontWeight: 700,
                fontSize: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {kollege.zeichen}
            </div>
            <div>
              <div
                style={{
                  fontFamily: schriften.mono,
                  fontSize: 26,
                  color: farben.text,
                  fontWeight: 700,
                }}
              >
                {kollege.tab}
              </div>
              <div
                style={{
                  fontFamily: schriften.text,
                  fontSize: 26,
                  color: kollege.farbe,
                }}
              >
                {t(kollege.text)}
              </div>
            </div>
          </div>
        </Erscheinen>
      ))}
    </>
  )
}
