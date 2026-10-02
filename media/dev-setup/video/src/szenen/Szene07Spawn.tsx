import type React from 'react'
import { Aussage, Erscheinen, feder, Terminal, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Drohne } from '../symbole'

const weitere = [
  'levinkeller.de',
  'hatchery',
  'dotfiles',
  'devcontainer-template',
  '…',
]

export const Szene07Spawn: React.FC = () => {
  const { bild, fps, t, bei } = useSzene()
  const hatcheryAb = bei({ de: 'verwaltet Hatchery', en: 'by Hatchery' }, -6)
  const befehlAb = bei({ de: 'Ein Befehl', en: 'One command' })
  const baut = bei({ de: 'baut daraus', en: 'builds a devcontainer' })
  const jsonAb = bei({ de: 'devcontainer-Punkt', en: 'devcontainer dot' })
  const features = [
    { name: 'SSH-Server', ab: bei({ de: 'SSH-Server', en: 'SSH server' }) },
    { name: 'Tailscale', ab: bei('Tailscale') },
    { name: 'GitHub CLI', ab: bei({ de: 'GitHub-CLI', en: 'GitHub CLI' }) },
    { name: 'Claude Code', ab: bei('Claude Code') },
    { name: 'zellij', ab: bei('zellij') },
  ]
  const parallelAb = bei({ de: 'Eine Umgebung pro', en: 'One environment per' })
  return (
    <>
      <Terminal
        x={80}
        y={190}
        w={900}
        h={360}
        titel="levin@dev-server"
        ab={hatcheryAb}
        zeilen={[
          {
            text: '$ hatchery spawn levino/shipyard',
            ab: befehlAb,
            farbe: farben.mensch,
          },
          {
            text: '→ git clone levino/shipyard',
            ab: baut - 6,
            farbe: farben.gedaempft,
          },
          {
            text: '→ devcontainer up',
            ab: baut + 10,
            farbe: farben.gedaempft,
          },
          {
            text: '  .devcontainer/devcontainer.json',
            ab: jsonAb,
            farbe: farben.gedaempft,
          },
          {
            text: '✓ hatchery-levino-shipyard',
            ab: features[0].ab - 10,
            farbe: farben.agent,
          },
        ]}
      />
      <Aussage
        x={80}
        y={580}
        ab={hatcheryAb + 6}
        ausrichtung="left"
        breite={900}
        groesse={34}
        farbe={farben.gedaempft}
      >
        {t({
          de: 'Hatchery · Open Source · github.com/levino/hatchery',
          en: 'Hatchery · open source · github.com/levino/hatchery',
        })}
      </Aussage>

      {/* Die Drohne, in die Hatchery seine Features steckt */}
      <Erscheinen
        ab={baut}
        art="skalieren"
        style={{ position: 'absolute', left: 1080, top: 190, width: 760 }}
      >
        <div
          style={{
            background: farben.flaeche,
            border: `4px solid ${farben.agent}`,
            borderRadius: 28,
            padding: '26px 32px',
            fontFamily: schriften.text,
            color: farben.text,
            boxShadow: `0 0 40px ${farben.agent}44`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Drohne farbe={farben.agent} groesse={76} />
            <div>
              <div style={{ fontSize: 44, fontWeight: 800 }}>
                {t({ de: 'Drohne', en: 'Drone' })}
              </div>
              <div
                style={{
                  fontFamily: schriften.mono,
                  fontSize: 28,
                  color: farben.gedaempft,
                }}
              >
                {t({
                  de: 'devcontainer.json aus dem Repo',
                  en: 'devcontainer.json from the repo',
                })}
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              marginTop: 24,
              minHeight: 130,
            }}
          >
            {features.map((feature) => {
              const f = feder(bild, feature.ab, fps)
              return (
                <div
                  key={feature.name}
                  style={{
                    opacity: Math.min(1, f * 1.4),
                    transform: `translateX(${(1 - f) * -160}px)`,
                    fontFamily: schriften.mono,
                    fontSize: 30,
                    fontWeight: 700,
                    padding: '10px 20px',
                    borderRadius: 14,
                    background: farben.agent,
                    color: farben.grund,
                  }}
                >
                  + {feature.name}
                </div>
              )
            })}
          </div>
        </div>
      </Erscheinen>

      {/* Eine Drohne pro Repository, viele parallel */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 700,
          width: 1760,
          display: 'flex',
          gap: 18,
        }}
      >
        {weitere.map((repo, index) => {
          const f = feder(bild, parallelAb + index * 7, fps)
          return (
            <div
              key={repo}
              style={{
                flex: 1,
                opacity: Math.min(1, f * 1.4),
                transform: `scale(${0.6 + 0.4 * f})`,
                background: farben.flaeche,
                border: `3px solid ${farben.agent}`,
                borderRadius: 22,
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Drohne farbe={farben.agent} groesse={60} />
              <div
                style={{
                  fontFamily: schriften.mono,
                  fontSize: 22,
                  color: farben.text,
                  textAlign: 'center',
                }}
              >
                {repo}
              </div>
            </div>
          )
        })}
      </div>
      <Aussage x={960} y={930} ab={parallelAb + 30} breite={1600} groesse={40}>
        {t({
          de: 'eine Drohne pro Repository – viele parallel',
          en: 'one drone per repository – many in parallel',
        })}
      </Aussage>
    </>
  )
}
