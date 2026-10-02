import type React from 'react'
import {
  Erscheinen,
  einblenden,
  Karte,
  Linie,
  Stempel,
  useSzene,
} from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Drohne, Handy, Kreuz, Laptop, Schloss, Wolke } from '../symbole'

const namen = [
  'hatchery-levino-shipyard',
  'hatchery-levino-levinkeller-de',
  'hatchery-levino-dotfiles',
]

export const Szene06Tailnet: React.FC = () => {
  const { bild, t, bei } = useSzene()
  const netzAb = bei({ de: 'privaten', en: 'private' })
  const namenAb = bei({ de: 'eigener Rechner', en: 'machine of its own' })
  const devAb = bei({ de: 'Dev-Server', en: 'dev server' })
  const handyAb = bei({ de: 'vom Handy', en: 'from the phone' })
  const portsAb = bei({ de: 'Keine Ports', en: 'No port' })
  const internetAb = bei({ de: 'Internet', en: 'internet' })
  const sicherheitAb = bei({ de: 'nicht für Sicherheit', en: 'not security' })
  const schluesselAb = bei({ de: 'Schlüssel', en: 'my key' })
  const ziel = 340 + 240
  return (
    <>
      <Erscheinen
        ab={netzAb - 10}
        art="blenden"
        style={{
          position: 'absolute',
          left: 90,
          top: 190,
          width: 1460,
          height: 820,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            border: `5px dashed ${farben.gedaempft}`,
            borderRadius: 40,
            background: 'rgba(29,39,66,0.35)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 26,
            fontFamily: schriften.text,
            fontSize: 38,
            fontWeight: 800,
            color: farben.gedaempft,
          }}
        >
          Tailnet · WireGuard
        </div>
      </Erscheinen>
      <Karte
        x={380}
        y={420}
        w={420}
        titel="Laptop"
        symbol={<Laptop farbe={farben.text} />}
        ab={netzAb}
      />
      <Karte
        x={380}
        y={700}
        w={420}
        titel={t({ de: 'Handy', en: 'Phone' })}
        symbol={<Handy farbe={farben.text} />}
        ab={netzAb + 8}
      />
      {namen.map((name, index) => {
        const y = 340 + index * 240
        return (
          <div key={name}>
            <Linie
              von={[600, 420]}
              nach={[860, y]}
              farbe={farben.gedaempft}
              ab={namenAb + index * 10}
              breite={5}
              pfeil={false}
            />
            <Karte
              x={1170}
              y={y}
              w={680}
              titel={t({ de: 'Drohne', en: 'Drone' })}
              unter={name}
              monoUnter
              farbe={farben.agent}
              symbol={<Drohne farbe={farben.agent} />}
              ab={namenAb + index * 10}
            />
            <Erscheinen
              ab={schluesselAb + index * 6}
              art="skalieren"
              style={{ position: 'absolute', left: 1432, top: y - 32 }}
            >
              <Schloss farbe={farben.mensch} groesse={64} />
            </Erscheinen>
          </div>
        )
      })}
      {/* Dev-Server über den Namen, vom Laptop wie vom Handy */}
      <Linie
        von={[600, 420]}
        nach={[825, ziel]}
        farbe={farben.mensch}
        ab={devAb}
        breite={7}
      />
      <Linie
        von={[600, 700]}
        nach={[825, ziel + 20]}
        farbe={farben.handy}
        ab={handyAb}
        breite={7}
      />
      <Erscheinen
        ab={devAb + 6}
        style={{ position: 'absolute', left: 130, top: 905, width: 1400 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            background: farben.flaeche,
            border: `3px solid ${farben.rand}`,
            borderRadius: 999,
            padding: '12px 30px',
            fontFamily: schriften.mono,
            fontSize: 30,
            color: farben.text,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: farben.deploy }}>●</span>
          <span>
            http://
            <span style={{ color: farben.agent, fontWeight: 700 }}>
              hatchery-levino-levinkeller-de
            </span>
            :4321
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: schriften.text,
              fontSize: 28,
              color: farben.gedaempft,
              opacity: einblenden(bild, portsAb),
            }}
          >
            {t({
              de: 'Name statt Port',
              en: 'name, not port',
            })}
          </span>
        </div>
      </Erscheinen>
      <Erscheinen
        ab={internetAb - 6}
        art="skalieren"
        style={{
          position: 'absolute',
          left: 1620,
          top: 470,
          width: 220,
          textAlign: 'center',
        }}
      >
        <Wolke farbe={farben.gedaempft} groesse={150} />
        <div
          style={{
            fontFamily: schriften.text,
            fontSize: 32,
            color: farben.gedaempft,
          }}
        >
          Internet
        </div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 10,
            opacity: einblenden(bild, internetAb + 6),
          }}
        >
          <Kreuz farbe={farben.fehler} groesse={130} />
        </div>
      </Erscheinen>
      <Stempel x={500} y={560} farbe={farben.mensch} ab={sicherheitAb}>
        {t({
          de: 'Erreichbarkeit ≠ Sicherheit',
          en: 'Reachability ≠ security',
        })}
      </Stempel>
    </>
  )
}
