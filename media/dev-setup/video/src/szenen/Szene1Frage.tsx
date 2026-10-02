import type React from 'react'
import { interpolate } from 'remotion'
import {
  Erscheinen,
  einblenden,
  feder,
  Linie,
  Terminal,
  useSzene,
} from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Kreuz, Schloss } from '../symbole'

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

export const Szene1Frage: React.FC = () => {
  const { bild, fps, t, bei } = useSzene()
  const agentenAb = bei({ de: 'mehrere', en: 'several' }, -8)
  const hoch = feder(bild, agentenAb - 6, fps)
  const identitaetAb = bei({ de: 'Bleibt eine Frage', en: 'Which raises' })
  const ohneAb = bei({ de: 'ohne ihnen', en: 'without' })
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
            de: 'Die Drohne ist die Sandbox',
            en: 'The drone is the sandbox',
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
      <Erscheinen
        ab={identitaetAb}
        art="skalieren"
        style={{ position: 'absolute', left: 1240, top: 330, width: 590 }}
      >
        <div
          style={{
            background: farben.flaeche,
            border: `4px solid ${farben.mensch}`,
            borderRadius: 28,
            padding: '34px 40px',
            fontFamily: schriften.text,
            color: farben.text,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Schloss farbe={farben.mensch} groesse={64} />
            <div style={{ fontSize: 46, fontWeight: 800 }}>
              {t({ de: 'Meine Identität', en: 'My identity' })}
            </div>
          </div>
          {[
            {
              de: 'GitHub-Account, alle Orgs',
              en: 'GitHub account, every org',
            },
            { de: 'SSH-Schlüssel', en: 'SSH key' },
            { de: 'Zugang zu Prod-Servern', en: 'Access to prod servers' },
          ].map((zeile, index) => (
            <div
              key={zeile.en}
              style={{
                fontSize: 34,
                color: farben.gedaempft,
                marginTop: index === 0 ? 26 : 12,
                opacity: einblenden(bild, identitaetAb + 10 + index * 8),
              }}
            >
              · {t(zeile)}
            </div>
          ))}
        </div>
      </Erscheinen>
      <Linie
        von={[1070, 560]}
        nach={[1225, 560]}
        pfeil={false}
        farbe={farben.fehler}
        ab={ohneAb - 10}
        dauer={14}
        breite={8}
      />
      <Erscheinen
        ab={ohneAb}
        art="skalieren"
        style={{ position: 'absolute', left: 1106, top: 518 }}
      >
        <Kreuz farbe={farben.fehler} groesse={84} />
      </Erscheinen>
    </>
  )
}
