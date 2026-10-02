import type React from 'react'
import { Aussage, Erscheinen, Karte, Linie, Paket, einblenden, useSzene } from '../bausteine'
import { farben } from '../gestaltung'
import { Drohne, Fingerabdruck, Kreuz, Laptop, Schloss, Schluessel, Server } from '../symbole'
import { Kanallegende } from './Szene5Agent'

export const Szene6Mensch: React.FC = () => {
  const { bild, t, bei } = useSzene()
  const enclaveAb = bei('Secure Enclave')
  const exportAb = bei({ de: 'nicht exportieren', en: 'cannot be exported' })
  const signaturAb = bei({ de: 'Jede einzelne', en: 'Every single' })
  const fingerAb = bei({ de: 'Fingerabdruck', en: 'fingerprint' })
  const forwardingAb = bei({ de: 'Agent-Forwarding', en: 'agent forwarding' })
  const prodAb = bei({ de: 'Produktionsserver', en: 'production server' })
  const fragenAb = bei({ de: 'höchstens fragen', en: 'ask me' })
  // Der Finger leuchtet bei jeder Signatur auf
  const signaturen = [fingerAb, fragenAb + 24]
  const leuchten = Math.max(0, ...signaturen.map((ab) => (bild >= ab ? Math.max(0, 1 - (bild - ab) / 25) : 0)))
  return (
    <>
      <Kanallegende ab={0} aktiv="mensch" />
      <Karte x={330} y={330} w={460} titel="Mac" unter="Secretive" symbol={<Laptop farbe={farben.mensch} />} farbe={farben.mensch} ab={6} />
      <Karte
        x={330}
        y={570}
        w={460}
        titel={t({ de: 'SSH-Schlüssel', en: 'SSH key' })}
        unter="Secure Enclave"
        symbol={<Schluessel farbe={farben.mensch} />}
        farbe={farben.mensch}
        ab={enclaveAb}
      />
      <Aussage x={330} y={670} ab={exportAb} breite={460} groesse={32} farbe={farben.gedaempft}>
        {t({ de: 'nicht exportierbar', en: 'cannot be exported' })}
      </Aussage>
      <Erscheinen ab={signaturAb} art="skalieren" style={{ position: 'absolute', left: 250, top: 760 }}>
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `5px solid ${farben.mensch}`,
            background: farben.flaeche,
            boxShadow: `0 0 ${20 + 80 * leuchten}px ${farben.mensch}`,
          }}
        >
          <Fingerabdruck farbe={farben.mensch} groesse={100} />
        </div>
      </Erscheinen>
      <Aussage x={460} y={810} ab={signaturAb + 10} ausrichtung="left" breite={420} groesse={34} farbe={farben.mensch}>
        {t({ de: 'jede Signatur: Touch ID', en: 'every signature: Touch ID' })}
      </Aussage>

      <Karte
        x={1000}
        y={330}
        w={420}
        titel={t({ de: 'Drohne', en: 'Drone' })}
        unter={t({ de: 'mit Agent', en: 'with an agent' })}
        symbol={<Drohne farbe={farben.agent} />}
        farbe={farben.agent}
        ab={forwardingAb - 14}
      />
      <Linie von={[565, 330]} nach={[780, 330]} farbe={farben.mensch} ab={forwardingAb} beschriftung="ssh -A" />
      <Karte
        x={1620}
        y={330}
        w={400}
        titel={t({ de: 'Prod-Server', en: 'Prod server' })}
        unter={t({ de: 'Deploy-Stack', en: 'deploy stack' })}
        symbol={<Server farbe={farben.deploy} />}
        farbe={farben.deploy}
        ab={prodAb - 16}
      />
      <Linie
        von={[1215, 330]}
        nach={[1410, 330]}
        farbe={farben.mensch}
        gestrichelt
        ab={prodAb}
        beschriftung={t({ de: 'nur mit Finger', en: 'finger only' })}
      />
      <Erscheinen ab={prodAb + 18} art="skalieren" style={{ position: 'absolute', left: 1268, top: 352 }}>
        <Kreuz farbe={farben.fehler} groesse={90} />
      </Erscheinen>
      <Erscheinen ab={prodAb + 18} art="skalieren" style={{ position: 'absolute', left: 1585, top: 470 }}>
        <Schloss farbe={farben.mensch} groesse={70} />
      </Erscheinen>
      <Paket von={[1000, 520]} nach={[520, 840]} ab={fragenAb - 4} dauer={26} halten={70} farbe={farben.mensch}>
        {t({ de: 'Darf ich? Bitte bestätigen', en: 'May I? Please confirm' })}
      </Paket>
      <div style={{ opacity: einblenden(bild, fragenAb + 30) }}>
        <Aussage x={1250} y={700} ab={fragenAb + 30} breite={900} groesse={42}>
          {t({ de: 'Der Agent fragt, ich entscheide', en: 'The agent asks, I decide' })}
        </Aussage>
      </div>
    </>
  )
}
