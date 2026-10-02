import type React from 'react'
import { interpolate } from 'remotion'
import {
  Aussage,
  Erscheinen,
  einblenden,
  feder,
  Karte,
  Linie,
  useSzene,
} from '../bausteine'
import { farben, schriften } from '../gestaltung'
import {
  Blitz,
  Drohne,
  Handy,
  Schreibtisch,
  Server,
  Zug,
  Zweig,
} from '../symbole'

const klemmen = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

/** Kleine Drohnen-Waben als Inhalt eines Servers */
const Waben: React.FC<{ ab: number; anzahl?: number }> = ({
  ab,
  anzahl = 5,
}) => {
  const { bild, fps } = useSzene()
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
      {Array.from({ length: anzahl }, (_, index) => index).map((index) => {
        const f = feder(bild, ab + index * 6, fps)
        return (
          <div
            key={index}
            style={{ opacity: f, transform: `scale(${0.4 + 0.6 * f})` }}
          >
            <Drohne farbe={farben.agent} groesse={52} />
          </div>
        )
      })}
    </div>
  )
}

export const Szene04Ueberall: React.FC = () => {
  const { bild, t, bei } = useSzene()
  const serverAb = 4
  const orte = [
    {
      ab: bei({ de: 'Schreibtisch', en: 'desk' }),
      y: 300,
      titel: { de: 'Schreibtisch', en: 'Desk' },
      symbol: <Schreibtisch farbe={farben.text} />,
      farbe: farben.mensch,
    },
    {
      ab: bei({ de: 'im Zug', en: 'on a train' }),
      y: 500,
      titel: { de: 'Zug', en: 'Train' },
      symbol: <Zug farbe={farben.text} />,
      farbe: farben.mensch,
    },
    {
      ab: bei({ de: 'mit dem Handy', en: 'my phone' }),
      y: 700,
      titel: { de: 'Handy', en: 'Phone' },
      symbol: <Handy farbe={farben.handy} />,
      farbe: farben.handy,
    },
  ]
  const groesserAb = bei({ de: 'kündige', en: 'cancel' })
  const ausfallAb = bei({ de: 'fällt er aus', en: 'if it dies' })
  const githubAb = bei('GitHub', -4)
  const neuAb = bei({ de: 'Jede Umgebung', en: 'Every environment' })
  const bauenAb = bei({ de: 'neu bauen', en: 'rebuilt' })
  const ausfall = einblenden(bild, ausfallAb, 8)
  const flackern =
    bild >= ausfallAb && bild < ausfallAb + 14 && Math.floor(bild / 2) % 2 === 0
  const orteAus = interpolate(
    bild,
    [ausfallAb, ausfallAb + 12],
    [1, 0.35],
    klemmen
  )
  return (
    <>
      {/* Server in der Mitte */}
      <Erscheinen
        ab={serverAb}
        art="skalieren"
        style={{ position: 'absolute', left: 700, top: 360, width: 520 }}
      >
        <div
          style={{
            background: farben.flaeche,
            border: `4px solid ${ausfall > 0.5 ? farben.fehler : farben.agent}`,
            borderRadius: 26,
            padding: '26px 30px',
            fontFamily: schriften.text,
            color: farben.text,
            opacity: flackern ? 0.3 : 1 - 0.5 * ausfall,
            boxShadow: `0 0 40px ${ausfall > 0.5 ? farben.fehler : farben.agent}44`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Server farbe={farben.text} groesse={60} />
            <div>
              <div style={{ fontSize: 44, fontWeight: 800 }}>
                {t({ de: 'Dev-Server', en: 'Dev server' })}
              </div>
              <div style={{ fontSize: 28, color: farben.gedaempft }}>
                {t({ de: 'gemietet', en: 'rented' })}
              </div>
            </div>
          </div>
          <Waben ab={serverAb + 10} />
        </div>
      </Erscheinen>
      <Erscheinen
        ab={ausfallAb + 4}
        art="skalieren"
        style={{ position: 'absolute', left: 1130, top: 320 }}
      >
        <Blitz farbe={farben.fehler} groesse={100} />
      </Erscheinen>

      {/* Von überall */}
      <div style={{ opacity: orteAus }}>
        {orte.map((ort) => (
          <div key={ort.titel.en}>
            <Karte
              x={300}
              y={ort.y}
              w={360}
              titel={t(ort.titel)}
              symbol={ort.symbol}
              farbe={ort.farbe}
              ab={ort.ab}
            />
            <Linie
              von={[485, ort.y]}
              nach={[690, 470]}
              farbe={ort.farbe}
              ab={ort.ab + 6}
              breite={6}
            />
          </div>
        ))}
      </div>

      {/* Zu klein? Größer mieten */}
      <Aussage
        x={960}
        y={640}
        ab={groesserAb}
        bis={ausfallAb - 4}
        breite={640}
        groesse={36}
        farbe={farben.deploy}
      >
        {t({
          de: 'zu klein? kündigen, größeren mieten',
          en: 'too small? cancel, rent a bigger one',
        })}
      </Aussage>

      {/* Ausfall: Code liegt auf GitHub, Umgebungen entstehen neu */}
      <Aussage
        x={960}
        y={640}
        ab={ausfallAb + 6}
        breite={640}
        groesse={36}
        farbe={farben.fehler}
      >
        {t({ de: 'Server fällt aus', en: 'Server dies' })}
      </Aussage>
      <Karte
        x={1590}
        y={300}
        w={440}
        titel="GitHub"
        unter={t({ de: 'der Code', en: 'the code' })}
        symbol={<Zweig farbe={farben.text} />}
        ab={githubAb}
      />
      <Erscheinen
        ab={neuAb}
        art="skalieren"
        style={{ position: 'absolute', left: 1330, top: 610, width: 520 }}
      >
        <div
          style={{
            background: farben.flaeche,
            border: `4px dashed ${farben.agent}`,
            borderRadius: 26,
            padding: '26px 30px',
            fontFamily: schriften.text,
            color: farben.text,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Server farbe={farben.text} groesse={60} />
            <div style={{ fontSize: 40, fontWeight: 800 }}>
              {t({ de: 'anderer Rechner', en: 'another machine' })}
            </div>
          </div>
          <Waben ab={bauenAb} />
        </div>
      </Erscheinen>
      <Linie
        von={[1590, 380]}
        nach={[1590, 600]}
        farbe={farben.agent}
        ab={neuAb + 8}
        breite={6}
        beschriftung="devcontainer.json"
        beschriftungVersatz={[-170, 6]}
      />
      <Aussage
        x={960}
        y={900}
        ab={bauenAb + 20}
        breite={1500}
        groesse={40}
        farbe={farben.text}
      >
        {t({
          de: 'Keine Hochverfügbarkeit nötig: nichts geht verloren',
          en: 'No high availability needed: nothing is lost',
        })}
      </Aussage>
    </>
  )
}
