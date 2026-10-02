import type React from 'react'
import { interpolate } from 'remotion'
import { Aussage, Erscheinen, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Haken } from '../symbole'

const klemmen = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

const dialoge = [
  'Bash(npm test)',
  'Edit(src/app.ts)',
  'Bash(git push)',
  'Bash(npm install)',
]

export const Szene10Rueckfragen: React.FC = () => {
  const { bild, t, bei } = useSzene()
  const abAb = bei({ de: 'Das klingt', en: 'That sounds' }, -12)
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
      ab: bei({ de: 'Token reicht', en: 'token only' }),
      text: { de: 'Token nur für ihre Repos', en: 'token scoped to its repos' },
    },
    {
      ab: bei({ de: 'braucht meinen Finger', en: 'needs my finger' }),
      text: {
        de: 'meine Identität braucht meinen Finger',
        en: 'my identity needs my finger',
      },
    },
  ]
  const kollegeAb = bei({ de: 'ständig fragt', en: 'keeps asking' })
  return (
    <>
      {/* Erlaubnis-Dialoge stapeln sich – und fliegen raus */}
      {dialoge.map((dialog, index) => {
        const ab = 4 + index * 7
        const weg = interpolate(
          bild,
          [abAb + index * 4, abAb + index * 4 + 14],
          [0, 1],
          klemmen
        )
        return (
          <Erscheinen
            key={dialog}
            ab={ab}
            art="skalieren"
            style={{
              position: 'absolute',
              left: 110 + index * 40,
              top: 220 + index * 110,
              width: 760,
            }}
          >
            <div
              style={{
                opacity: 1 - weg,
                transform: `translateX(${-500 * weg}px) rotate(${-8 * weg}deg)`,
                background: farben.flaeche,
                border: `3px solid ${farben.rand}`,
                borderRadius: 20,
                padding: '20px 26px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
                fontFamily: schriften.text,
                color: farben.text,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 700 }}>
                {t({ de: 'Erlauben?', en: 'Allow?' })}{' '}
                <span
                  style={{ fontFamily: schriften.mono, color: farben.agent }}
                >
                  {dialog}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  marginTop: 14,
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                {[
                  { de: 'Ja', en: 'Yes' },
                  { de: 'Nein', en: 'No' },
                ].map((knopf, k) => (
                  <div
                    key={knopf.en}
                    style={{
                      padding: '6px 22px',
                      borderRadius: 10,
                      background: k === 0 ? farben.agent : farben.flaecheHell,
                      color: k === 0 ? farben.grund : farben.gedaempft,
                    }}
                  >
                    {t(knopf)}
                  </div>
                ))}
              </div>
            </div>
          </Erscheinen>
        )
      })}
      <Erscheinen
        ab={abAb + 16}
        art="skalieren"
        style={{ position: 'absolute', left: 110, top: 470 }}
      >
        <div
          style={{
            fontFamily: schriften.mono,
            fontSize: 38,
            fontWeight: 700,
            color: farben.mensch,
            border: `4px solid ${farben.mensch}`,
            borderRadius: 16,
            padding: '14px 26px',
            background: farben.flaeche,
          }}
        >
          claude --dangerously-skip-permissions
        </div>
      </Erscheinen>

      {/* Warum das geht */}
      <Erscheinen
        ab={sandboxAb}
        style={{ position: 'absolute', left: 1120, top: 220, width: 720 }}
      >
        <div
          style={{
            fontFamily: schriften.text,
            fontSize: 54,
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
            left: 1120,
            top: 400 + index * 100,
            width: 720,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontFamily: schriften.text,
              fontSize: 36,
              color: farben.text,
            }}
          >
            <Haken farbe={farben.deploy} groesse={50} />
            {t(grund.text)}
          </div>
        </Erscheinen>
      ))}
      <Aussage
        x={960}
        y={820}
        ab={kollegeAb}
        breite={1600}
        groesse={46}
        farbe={farben.gedaempft}
      >
        {t({
          de: '„Ein Agent, der ständig fragt, ist ein sehr langsamer Kollege.“',
          en: '“An agent that keeps asking is a very slow colleague.”',
        })}
      </Aussage>
    </>
  )
}
