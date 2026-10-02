import type React from 'react'
import { Erscheinen, Karte, Linie, Stempel, einblenden, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Drohne, Handy, Kreuz, Laptop, Schloss, Wolke } from '../symbole'

const namen = ['hatchery-levino-shipyard', 'hatchery-levino-levinkeller-de', 'hatchery-levino-dotfiles']

export const Szene3Tailnet: React.FC = () => {
  const { bild, t, bei } = useSzene()
  const netzAb = bei({ de: 'privates', en: 'private' })
  const namenAb = bei({ de: 'eigener Rechner', en: 'machine of its own' })
  const portsAb = bei({ de: 'Keine Ports', en: 'No port' })
  const internetAb = bei({ de: 'Internet', en: 'internet' })
  const sicherheitAb = bei({ de: 'nicht für Sicherheit', en: 'not security' })
  const schluesselAb = bei({ de: 'Schlüssel', en: 'my key' })
  return (
    <>
      <Erscheinen ab={netzAb - 10} art="blenden" style={{ position: 'absolute', left: 90, top: 190, width: 1460, height: 820 }}>
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
      <Karte x={380} y={420} w={420} titel="Laptop" symbol={<Laptop farbe={farben.text} />} ab={netzAb} />
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
            <Linie von={[600, 420]} nach={[860, y]} farbe={farben.gedaempft} ab={namenAb + index * 10} breite={5} pfeil={false} />
            <Karte
              x={1150}
              y={y}
              w={620}
              titel={t({ de: 'Drohne', en: 'Drone' })}
              unter={name}
              monoUnter
              farbe={farben.agent}
              symbol={<Drohne farbe={farben.agent} />}
              ab={namenAb + index * 10}
            />
            <Erscheinen ab={schluesselAb + index * 6} art="skalieren" style={{ position: 'absolute', left: 1395, top: y - 32 }}>
              <Schloss farbe={farben.mensch} groesse={64} />
            </Erscheinen>
          </div>
        )
      })}
      <Erscheinen ab={portsAb} style={{ position: 'absolute', left: 170, top: 880, width: 900 }}>
        <div style={{ fontFamily: schriften.mono, fontSize: 32, color: farben.text }}>
          {t({ de: 'Name statt Port: ', en: 'name, not port: ' })}
          <span style={{ color: farben.agent }}>hatchery-levino-shipyard:&lt;port&gt;</span>
        </div>
      </Erscheinen>
      <Erscheinen ab={internetAb - 6} art="skalieren" style={{ position: 'absolute', left: 1620, top: 470, width: 220, textAlign: 'center' }}>
        <Wolke farbe={farben.gedaempft} groesse={150} />
        <div style={{ fontFamily: schriften.text, fontSize: 32, color: farben.gedaempft }}>Internet</div>
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
      <Stempel x={760} y={560} farbe={farben.mensch} ab={sicherheitAb}>
        {t({ de: 'Erreichbarkeit ≠ Sicherheit', en: 'Reachability ≠ security' })}
      </Stempel>
    </>
  )
}
