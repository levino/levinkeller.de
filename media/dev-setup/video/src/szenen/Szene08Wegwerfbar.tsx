import type React from 'react'
import { interpolate } from 'remotion'
import {
  Aussage,
  Erscheinen,
  einblenden,
  Karte,
  Linie,
  useSzene,
} from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Drohne, Haken } from '../symbole'

export const Szene08Wegwerfbar: React.FC = () => {
  const { bild, t, bei } = useSzene()
  const zergAb = bei('Zerg', -10)
  const devcontainerAb = 6
  const befehle = [
    { name: 'spawn', ab: bei({ de: 'spawnt', en: 'spawn them' }) },
    { name: 'burrow', ab: bei({ de: 'gräbt', en: 'burrow' }) },
    { name: 'unburrow', ab: bei({ de: 'gräbt', en: 'burrow' }, 14) },
    { name: 'slay', ab: bei({ de: 'erledigt', en: 'slay' }) },
  ]
  const wegwerfAb = bei({ de: 'wegwerfbar', en: 'disposable' })
  const hostAb = bei({ de: 'Code und Claude', en: 'The code' })
  const neubauAb = bei({ de: 'Nach einem Neubau', en: 'After a rebuild' })
  const portabelAb = bei({ de: 'portabel', en: 'portable' })
  const dotfilesAb = bei('dotfiles')
  // Drohne verschwindet kurz und wird neu gebaut – Code und Claude-Zustand bleiben auf dem Host
  const weg = interpolate(
    bild,
    [wegwerfAb, wegwerfAb + 10, neubauAb - 10, neubauAb + 5],
    [1, 0.12, 0.12, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 200,
          display: 'flex',
          gap: 22,
        }}
      >
        {befehle.map((befehl, index) => {
          const an =
            einblenden(bild, befehl.ab, 6) *
            (1 - einblenden(bild, (befehle[index + 1]?.ab ?? wegwerfAb) + 4, 8))
          return (
            <Erscheinen key={befehl.name} ab={zergAb + index * 5}>
              <div
                style={{
                  fontFamily: schriften.mono,
                  fontSize: 36,
                  fontWeight: 700,
                  padding: '14px 26px',
                  borderRadius: 16,
                  border: `3px solid ${farben.agent}`,
                  background: an > 0.5 ? farben.agent : farben.flaeche,
                  color: an > 0.5 ? farben.grund : farben.agent,
                  transform: `scale(${1 + 0.12 * an})`,
                }}
              >
                {befehl.name}
              </div>
            </Erscheinen>
          )
        })}
      </div>
      <Aussage
        x={80}
        y={310}
        ab={zergAb}
        ausrichtung="left"
        breite={900}
        groesse={36}
        farbe={farben.gedaempft}
      >
        {t({
          de: 'Benannt im Stil der Zerg aus StarCraft',
          en: 'Named in StarCraft Zerg style',
        })}
      </Aussage>

      <div style={{ opacity: weg }}>
        <Karte
          x={1450}
          y={330}
          w={700}
          titel={t({ de: 'Drohne', en: 'Drone' })}
          unter={
            <>
              <div style={{ fontFamily: schriften.mono }}>levino/shipyard</div>
              <div>
                {t({
                  de: 'Devcontainer aus dem Repo',
                  en: 'devcontainer from the repo',
                })}
              </div>
            </>
          }
          farbe={farben.agent}
          symbol={<Drohne farbe={farben.agent} groesse={80} />}
          ab={devcontainerAb}
          leuchten={0.3}
        />
      </div>
      <Aussage
        x={1450}
        y={470}
        ab={wegwerfAb}
        bis={neubauAb - 10}
        groesse={40}
        breite={700}
        farbe={farben.fehler}
      >
        <span
          style={{
            background: farben.grund,
            padding: '4px 14px',
            borderRadius: 12,
          }}
        >
          {t({
            de: 'wegwerfbar: weg und neu gebaut',
            en: 'disposable: deleted and rebuilt',
          })}
        </span>
      </Aussage>

      <Erscheinen
        ab={hostAb - 10}
        art="blenden"
        style={{
          position: 'absolute',
          left: 1060,
          top: 610,
          width: 780,
          height: 400,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            border: `4px solid ${farben.rand}`,
            borderRadius: 30,
            background: 'rgba(21,29,51,0.6)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 30,
            bottom: 18,
            fontFamily: schriften.text,
            fontSize: 34,
            fontWeight: 800,
            color: farben.gedaempft,
          }}
        >
          {t({ de: 'Host (bleibt)', en: 'Host (stays)' })}
        </div>
      </Erscheinen>
      <Karte
        x={1260}
        y={850}
        w={340}
        titel="Code"
        unter="Git-Worktree"
        monoUnter
        ab={hostAb}
      />
      <Karte
        x={1640}
        y={850}
        w={340}
        titel="Claude"
        unter={t({
          de: 'Login, Gedächtnis, Verlauf',
          en: 'login, memory, history',
        })}
        ab={hostAb + 8}
      />
      <Linie
        von={[1260, 770]}
        nach={[1330, 440]}
        farbe={farben.gedaempft}
        ab={hostAb + 14}
        breite={5}
        beschriftung="mount"
        beschriftungVersatz={[-80, -40]}
      />
      <Linie
        von={[1640, 770]}
        nach={[1570, 440]}
        farbe={farben.gedaempft}
        ab={hostAb + 20}
        breite={5}
      />
      <Aussage
        x={1450}
        y={470}
        ab={neubauAb + 6}
        groesse={36}
        breite={760}
        farbe={farben.deploy}
      >
        <span
          style={{
            background: farben.grund,
            padding: '4px 14px',
            borderRadius: 12,
          }}
        >
          {t({
            de: 'neu gebaut – der Agent weiß noch, woran er war',
            en: 'rebuilt – the agent still knows what it was doing',
          })}
        </span>
      </Aussage>

      {/* Repos bleiben portabel, dotfiles kommen mit */}
      <Karte
        x={510}
        y={520}
        w={860}
        titel={t({ de: 'Repos bleiben portabel', en: 'Repos stay portable' })}
        unter={t({
          de: 'dieselbe devcontainer.json: Hatchery, Codespaces, VS Code lokal',
          en: 'same devcontainer.json: Hatchery, Codespaces, local VS Code',
        })}
        symbol={<Haken farbe={farben.deploy} groesse={60} />}
        farbe={farben.deploy}
        ab={portabelAb}
      />
      <Karte
        x={510}
        y={760}
        w={860}
        titel={t({
          de: 'dotfiles in jeder Drohne',
          en: 'dotfiles in every drone',
        })}
        unter={t({
          de: 'Shell, Git, globale CLAUDE.md, Skills',
          en: 'shell, git, global CLAUDE.md, skills',
        })}
        symbol={<Drohne farbe={farben.agent} groesse={60} />}
        farbe={farben.agent}
        ab={dotfilesAb}
      />
    </>
  )
}
