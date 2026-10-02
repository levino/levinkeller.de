import type React from 'react'
import { Erscheinen, Karte, Linie, Terminal, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Haken, Handy } from '../symbole'

export const Szene7Arbeitsplatz: React.FC = () => {
  const { t, bei } = useSzene()
  const zellijAb = bei('zellij', -10)
  const agentenAb = bei({ de: 'mehrere Agenten', en: 'several agents' })
  const ohneAb = bei({ de: 'ohne Rückfragen', en: 'without permission' })
  const sandboxAb = bei({
    de: 'die Drohne ist die Sandbox',
    en: 'the drone is the sandbox',
  })
  const gruende = [
    {
      ab: bei({ de: 'wegwerfbar', en: 'disposable' }),
      text: { de: 'wegwerfbar', en: 'disposable' },
    },
    {
      ab: bei({ de: 'Token ist begrenzt', en: 'token is scoped' }),
      text: { de: 'Token nur für ihre Repos', en: 'token scoped to its repos' },
    },
    {
      ab: bei({ de: 'Heikle', en: 'sensitive' }),
      text: {
        de: 'Heikles braucht meinen Finger',
        en: 'sensitive things need my finger',
      },
    },
  ]
  const handyAb = bei({ de: 'Unterwegs', en: 'On the go' })
  const remoteAb = bei('Remote Control')
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
          {['shipyard', 'levinkeller.de', 'hatchery'].map((tab, index) => (
            <div
              key={tab}
              style={{
                background: index === 0 ? farben.flaecheHell : farben.flaeche,
                color: index === 0 ? farben.text : farben.gedaempft,
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
      <Erscheinen
        ab={ohneAb}
        art="skalieren"
        style={{ position: 'absolute', left: 80, top: 930 }}
      >
        <div
          style={{
            fontFamily: schriften.mono,
            fontSize: 34,
            fontWeight: 700,
            color: farben.mensch,
            border: `3px solid ${farben.mensch}`,
            borderRadius: 14,
            padding: '10px 22px',
            background: farben.flaeche,
          }}
        >
          claude --dangerously-skip-permissions
        </div>
      </Erscheinen>

      <Erscheinen
        ab={sandboxAb}
        style={{ position: 'absolute', left: 1400, top: 250, width: 460 }}
      >
        <div
          style={{
            fontFamily: schriften.text,
            fontSize: 44,
            fontWeight: 850,
            color: farben.text,
            lineHeight: 1.15,
          }}
        >
          {t({
            de: 'Die Drohne ist die Sandbox',
            en: 'The drone is the sandbox',
          })}
        </div>
      </Erscheinen>
      {gruende.map((grund, index) => (
        <Erscheinen
          key={grund.text.en}
          ab={grund.ab}
          style={{
            position: 'absolute',
            left: 1400,
            top: 400 + index * 90,
            width: 460,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontFamily: schriften.text,
              fontSize: 32,
              color: farben.text,
            }}
          >
            <Haken farbe={farben.deploy} groesse={44} />
            {t(grund.text)}
          </div>
        </Erscheinen>
      ))}
      <Karte
        x={1620}
        y={810}
        w={440}
        titel={t({ de: 'Handy', en: 'Phone' })}
        unter={t({ de: 'Claude-App', en: 'Claude app' })}
        symbol={<Handy farbe={farben.handy} />}
        farbe={farben.handy}
        ab={handyAb}
      />
      <Linie
        von={[1345, 720]}
        nach={[1395, 810]}
        via={[1350, 810]}
        farbe={farben.handy}
        ab={remoteAb - 10}
        pfeil={false}
        breite={8}
      />
      <Erscheinen
        ab={remoteAb}
        style={{
          position: 'absolute',
          left: 1400,
          top: 905,
          width: 440,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: schriften.mono,
            fontWeight: 700,
            fontSize: 28,
            color: farben.handy,
          }}
        >
          Remote Control
        </div>
      </Erscheinen>
    </>
  )
}
