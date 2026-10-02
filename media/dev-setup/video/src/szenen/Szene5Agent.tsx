import type React from 'react'
import { Aussage, Erscheinen, Karte, Linie, Paket, Stempel, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Drohne, Schloss, Zweig } from '../symbole'

export const Kanallegende: React.FC<{ ab: number; aktiv: 'agent' | 'mensch' }> = ({ ab, aktiv }) => {
  const { t } = useSzene()
  const eintraege = [
    { id: 'agent', farbe: farben.agent, text: t({ de: 'Agenten-Kanal', en: 'Agent channel' }) },
    { id: 'mensch', farbe: farben.mensch, text: t({ de: 'Mensch-Kanal', en: 'Human channel' }) },
  ]
  return (
    <div style={{ position: 'absolute', right: 80, top: 62, display: 'flex', gap: 18 }}>
      {eintraege.map((eintrag, index) => (
        <Erscheinen key={eintrag.id} ab={ab + index * 6}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 20px',
              borderRadius: 999,
              border: `3px solid ${eintrag.farbe}`,
              background: eintrag.id === aktiv ? eintrag.farbe : 'transparent',
              color: eintrag.id === aktiv ? farben.grund : eintrag.farbe,
              fontFamily: schriften.text,
              fontWeight: 750,
              fontSize: 30,
            }}
          >
            {eintrag.text}
          </div>
        </Erscheinen>
      ))}
    </div>
  )
}

export const Szene5Agent: React.FC = () => {
  const { t, bei } = useSzene()
  const zweiAb = bei({ de: 'zwei getrennte', en: 'two separate' })
  const appAb = bei({ de: 'GitHub-App', en: 'GitHub App' })
  const credsAb = bei({ de: 'Credential-Service', en: 'credential service' })
  const socketAb = bei({ de: 'Unix-Socket', en: 'Unix socket' })
  const fragtAb = bei({ de: 'Bei jedem Zugriff', en: 'On every access' })
  const tokenAb = bei({ de: 'frischen Token', en: 'fresh token' })
  const nurAb = bei({ de: 'nur für die', en: 'scoped to' })
  const andersAb = bei({ de: 'Alles andere', en: 'Anything else' })
  const passwortAb = bei({ de: 'Gespeichert wird nichts', en: 'Nothing is stored' })
  const mountAb = bei({ de: 'Die Identität', en: 'The identity' })
  const leckAb = bei({ de: 'geleakter', en: 'leaked' })
  return (
    <>
      <Kanallegende ab={zweiAb} aktiv="agent" />
      <Karte
        x={1590}
        y={420}
        w={440}
        titel="GitHub"
        unter={t({ de: 'GitHub-App', en: 'GitHub App' })}
        symbol={<Zweig farbe={farben.text} />}
        ab={appAb}
      />
      <Karte
        x={350}
        y={420}
        w={500}
        titel={t({ de: 'Credential-Service', en: 'Credential service' })}
        unter={t({ de: 'kennt den App-Schlüssel', en: 'holds the app key' })}
        symbol={<Schloss farbe={farben.agent} />}
        farbe={farben.agent}
        ab={credsAb}
      />
      <Karte
        x={965}
        y={420}
        w={400}
        titel={t({ de: 'Drohne', en: 'Drone' })}
        unter="levino/shipyard"
        monoUnter
        symbol={<Drohne farbe={farben.agent} />}
        farbe={farben.agent}
        ab={credsAb + 10}
      />
      <Linie von={[605, 420]} nach={[760, 420]} farbe={farben.agent} ab={socketAb} pfeil={false} breite={10} />
      <Aussage x={682} y={490} ab={socketAb + 6} breite={300} groesse={28} farbe={farben.agent}>
        Unix-Socket
      </Aussage>

      <Paket von={[965, 300]} nach={[400, 300]} ab={fragtAb} dauer={22} halten={10} farbe={farben.text}>
        {t({ de: 'git: Token, bitte', en: 'git: token, please' })}
      </Paket>
      <Paket von={[400, 580]} nach={[965, 580]} ab={tokenAb} dauer={22} halten={nurAb - tokenAb + 40} farbe={farben.agent}>
        {t({ de: 'frischer Token · nur levino/shipyard', en: 'fresh token · levino/shipyard only' })}
      </Paket>
      <Linie
        von={[1170, 420]}
        nach={[1360, 420]}
        farbe={farben.agent}
        ab={nurAb + 10}
        beschriftung="git push ✓"
        beschriftungVersatz={[0, -40]}
      />

      <Paket von={[965, 700]} nach={[420, 700]} ab={andersAb - 6} dauer={20} halten={60} farbe={farben.fehler}>
        ?repo=levino/other
      </Paket>
      <Erscheinen ab={andersAb + 16} art="skalieren" style={{ position: 'absolute', left: 120, top: 640 }}>
        <div style={{ fontFamily: schriften.mono, fontWeight: 700, fontSize: 96, color: farben.fehler }}>403</div>
      </Erscheinen>

      <Aussage x={960} y={800} ab={passwortAb} bis={leckAb - 6} groesse={40} breite={1500} farbe={farben.gedaempft}>
        {t({ de: 'Nichts gespeichert: der Socket existiert nur in dieser Drohne', en: 'Nothing stored: the socket only exists inside this drone' })}
      </Aussage>
      <Aussage x={960} y={800} ab={leckAb} groesse={40} breite={1500} farbe={farben.gedaempft}>
        {t({ de: 'Geleakter Token? Nach spätestens 1 h wertlos', en: 'Leaked token? Useless within the hour' })}
      </Aussage>
      <Stempel x={960} y={920} farbe={farben.agent} ab={mountAb} drehung={-3}>
        {t({ de: 'Die Identität ist der Mount', en: 'The identity is the mount' })}
      </Stempel>
    </>
  )
}
