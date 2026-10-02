import type React from 'react'
import { interpolate } from 'remotion'
import { Erscheinen, einblenden, feder, Terminal, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Schloss, Server } from '../symbole'

const repos = [
  'levino/shipyard',
  'levino/levinkeller.de',
  'levino/hatchery',
  'levino/dotfiles',
]
const zeilen = [
  ['● Read src/app.ts', '● Edit tests', '✓ 14 passed'],
  ['● Edit content/docs', '● npm run build', '✓ build ok'],
  ['● Grep "socket"', '● Edit src/creds', '● git push'],
  ['● Read README', '● Edit zshrc', '✓ done'],
]

export const Szene01Start: React.FC = () => {
  const { bild, fps, t, bei } = useSzene()
  const agentenAb = bei({ de: 'Mehrere', en: 'Several' }, -8)
  const hoch = feder(bild, agentenAb - 6, fps)
  const fragen = [
    {
      ab: bei({ de: 'Wo laufen', en: 'Where do' }),
      titel: { de: 'Wo laufen sie?', en: 'Where do they run?' },
      unter: {
        de: 'bequem · von überall erreichbar',
        en: 'comfortably · reachable from anywhere',
      },
      farbe: farben.agent,
      symbol: <Server farbe={farben.agent} groesse={64} />,
    },
    {
      ab: bei({ de: 'Und was dürfen', en: 'And what are' }),
      titel: { de: 'Was dürfen sie?', en: 'What may they do?' },
      unter: {
        de: 'ohne meine Identität',
        en: 'without my identity',
      },
      farbe: farben.mensch,
      symbol: <Schloss farbe={farben.mensch} groesse={64} />,
    },
  ]
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: interpolate(hoch, [0, 1], [360, 60]),
          textAlign: 'center',
          fontFamily: schriften.text,
        }}
      >
        <div
          style={{
            fontSize: interpolate(hoch, [0, 1], [118, 64]),
            fontWeight: 850,
            color: farben.text,
            letterSpacing: -2,
          }}
        >
          {t({
            de: 'Viele Agenten, ein Arbeitsplatz',
            en: 'Many agents, one workplace',
          })}
        </div>
        <div
          style={{
            fontSize: interpolate(hoch, [0, 1], [48, 34]),
            color: farben.gedaempft,
            marginTop: 14,
          }}
        >
          {t({
            de: 'Mein Dev-Setup für KI-Agenten',
            en: 'My dev setup for AI agents',
          })}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 80,
          bottom: 44,
          fontFamily: schriften.mono,
          fontSize: 26,
          color: farben.gedaempft,
          opacity: 1 - einblenden(bild, agentenAb, 10) * 0.4,
        }}
      >
        {t({ de: 'Stimme: KI-generiert', en: 'Voice: AI-generated' })}
      </div>
      {repos.map((repo, index) => {
        const ab = agentenAb + index * 8
        return (
          <Terminal
            key={repo}
            x={90 + (index % 2) * 500}
            y={270 + Math.floor(index / 2) * 330}
            w={470}
            h={300}
            titel={repo}
            ab={ab}
            farbe={farben.agent}
            schrift={27}
            zeilen={zeilen[index].map((text, zeile) => ({
              text,
              ab: ab + 12 + zeile * 22,
              farbe: text.startsWith('✓') ? farben.deploy : farben.text,
            }))}
          />
        )
      })}
      <Erscheinen
        ab={bei({ de: 'ich lese', en: 'and I read' })}
        style={{ position: 'absolute', left: 90, top: 918, width: 970 }}
      >
        <div
          style={{
            fontFamily: schriften.text,
            fontSize: 40,
            fontWeight: 700,
            color: farben.mensch,
            textAlign: 'center',
          }}
        >
          {t({
            de: 'Ich: lesen · lenken · entscheiden',
            en: 'Me: read · steer · decide',
          })}
        </div>
      </Erscheinen>
      {fragen.map((frage, index) => (
        <Erscheinen
          key={frage.titel.en}
          ab={frage.ab}
          art="skalieren"
          style={{
            position: 'absolute',
            left: 1150,
            top: 290 + index * 330,
            width: 690,
          }}
        >
          <div
            style={{
              background: farben.flaeche,
              border: `4px solid ${frage.farbe}`,
              borderRadius: 28,
              padding: '30px 38px',
              fontFamily: schriften.text,
              color: farben.text,
              boxShadow: `0 0 ${30 * einblenden(bild, frage.ab, 20)}px ${frage.farbe}55`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              {frage.symbol}
              <div style={{ fontSize: 50, fontWeight: 800 }}>
                {t(frage.titel)}
              </div>
            </div>
            <div
              style={{
                fontSize: 34,
                color: frage.farbe,
                marginTop: 16,
                fontWeight: 700,
              }}
            >
              {t(frage.unter)}
            </div>
          </div>
        </Erscheinen>
      ))}
    </>
  )
}
