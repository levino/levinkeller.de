import type React from 'react'
import { Aussage, Erscheinen, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'

const repos = [
  'hatchery',
  'dotfiles',
  'devcontainer-template',
  'levinkeller.de',
]

export const Szene16Abspann: React.FC = () => {
  const { sprache, t, bei } = useSzene()
  const urlAb = bei({ de: 'levinkeller Punkt', en: 'levinkeller dot' }, -10)
  const llmsAb = bei({ de: 'llms Punkt', en: 'llms dot' }, -6)
  const quetschenAb = bei({ de: 'quetsch', en: 'grill' })
  return (
    <>
      <Aussage
        x={960}
        y={220}
        ab={6}
        breite={1600}
        groesse={44}
        farbe={farben.gedaempft}
      >
        {t({
          de: 'Die ganze Architektur, mit Begründungen und Alternativen:',
          en: 'The full architecture, with reasoning and alternatives:',
        })}
      </Aussage>
      <Erscheinen
        ab={urlAb}
        art="skalieren"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 320,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: schriften.mono,
            fontWeight: 700,
            fontSize: 82,
            color: farben.text,
          }}
        >
          levinkeller.de
          <span style={{ color: farben.agent }}>/{sprache}/docs/dev-setup</span>
        </div>
      </Erscheinen>
      <Erscheinen
        ab={llmsAb}
        art="skalieren"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 500,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            border: `4px solid ${farben.handy}`,
            borderRadius: 24,
            padding: '20px 36px',
            background: farben.flaeche,
            fontFamily: schriften.text,
            fontSize: 44,
            color: farben.text,
          }}
        >
          <span
            style={{
              fontFamily: schriften.mono,
              fontWeight: 700,
              color: farben.handy,
            }}
          >
            llms.txt
          </span>
          <span>
            {t({ de: '→ deiner KI geben', en: '→ hand it to your AI' })}
          </span>
          <span style={{ opacity: 0.9, color: farben.gedaempft }}>
            {t({ de: '… und ausquetschen', en: '… and grill it' })}
          </span>
        </div>
      </Erscheinen>
      <Erscheinen
        ab={quetschenAb + 10}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 700,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: schriften.text,
            fontSize: 32,
            color: farben.gedaempft,
            marginBottom: 20,
          }}
        >
          Open Source · github.com/levino
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {repos.map((repo) => (
            <div
              key={repo}
              style={{
                fontFamily: schriften.mono,
                fontSize: 32,
                fontWeight: 700,
                color: farben.agent,
                border: `3px solid ${farben.rand}`,
                borderRadius: 14,
                padding: '10px 22px',
                background: farben.flaeche,
              }}
            >
              {repo}
            </div>
          ))}
        </div>
      </Erscheinen>
      <Erscheinen
        ab={quetschenAb + 20}
        art="blenden"
        style={{ position: 'absolute', left: 80, bottom: 44 }}
      >
        <div
          style={{
            fontFamily: schriften.mono,
            fontSize: 26,
            color: farben.gedaempft,
          }}
        >
          {t({
            de: 'Stimme: KI-generiert (Gemini TTS) · Gebaut mit Remotion',
            en: 'Voice: AI-generated (Gemini TTS) · Built with Remotion',
          })}
        </div>
      </Erscheinen>
    </>
  )
}
