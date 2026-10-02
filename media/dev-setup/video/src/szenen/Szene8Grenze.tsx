import type React from 'react'
import { Aussage, Erscheinen, Karte, Linie, useSzene } from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Drohne, Kreuz, Server, Zweig } from '../symbole'

export const Szene8Grenze: React.FC = () => {
  const { t, bei } = useSzene()
  const githubAb = bei('GitHub', -10)
  const abDaAb = bei({ de: 'Ab da', en: 'From there' })
  const argoAb = bei('Argo CD')
  const pushAb = bei({ de: 'Agenten pushen', en: 'Agents push' })
  const zugangAb = bei({ de: 'Zugang zum Cluster', en: 'no access' })
  const y = 470
  return (
    <>
      <Karte
        x={230}
        y={y}
        w={300}
        titel={t({ de: 'Drohne', en: 'Drone' })}
        symbol={<Drohne farbe={farben.agent} />}
        farbe={farben.agent}
        ab={6}
      />
      <Karte
        x={640}
        y={y}
        w={300}
        titel="GitHub"
        symbol={<Zweig farbe={farben.text} />}
        ab={githubAb}
      />
      <Linie
        von={[385, y]}
        nach={[485, y]}
        farbe={farben.agent}
        ab={githubAb + 6}
      />
      <Erscheinen
        ab={githubAb + 10}
        art="blenden"
        style={{
          position: 'absolute',
          left: 860,
          top: 200,
          width: 6,
          height: 700,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `repeating-linear-gradient(${farben.text} 0 22px, transparent 22px 40px)`,
          }}
        />
      </Erscheinen>
      <Aussage
        x={460}
        y={880}
        ab={githubAb + 14}
        breite={760}
        groesse={36}
        farbe={farben.gedaempft}
      >
        {t({ de: 'Dev-Setup (dieser Teil)', en: 'Dev setup (this part)' })}
      </Aussage>
      <Aussage
        x={1380}
        y={880}
        ab={abDaAb}
        breite={900}
        groesse={36}
        farbe={farben.deploy}
      >
        {t({ de: 'Deploy-Stack (Teil 2)', en: 'Deploy stack (part 2)' })}
      </Aussage>
      <Karte
        x={1060}
        y={y}
        w={240}
        titel="CI"
        ab={abDaAb}
        farbe={farben.deploy}
      />
      <Linie
        von={[795, y]}
        nach={[935, y]}
        farbe={farben.deploy}
        ab={abDaAb + 4}
      />
      <Karte
        x={1380}
        y={y}
        w={280}
        titel="Argo CD"
        ab={argoAb}
        farbe={farben.deploy}
      />
      <Linie
        von={[1185, y]}
        nach={[1235, y]}
        farbe={farben.deploy}
        ab={argoAb + 4}
      />
      <Karte
        x={1715}
        y={y}
        w={250}
        titel="k3s"
        unter="Cluster"
        symbol={<Server farbe={farben.deploy} groesse={44} />}
        farbe={farben.deploy}
        ab={argoAb + 12}
        stil={{ padding: '22px 18px' }}
      />
      <Linie
        von={[1525, y]}
        nach={[1585, y]}
        farbe={farben.deploy}
        ab={argoAb + 16}
      />

      <Erscheinen
        ab={pushAb}
        style={{ position: 'absolute', left: 80, top: 610, width: 720 }}
      >
        <div
          style={{
            fontFamily: schriften.mono,
            fontSize: 32,
            lineHeight: 1.7,
            color: farben.agent,
          }}
        >
          <div>git push origin feature</div>
          <div>gh pr create</div>
        </div>
      </Erscheinen>
      <Linie
        von={[230, 400]}
        nach={[1715, 380]}
        via={[970, 120]}
        farbe={farben.fehler}
        gestrichelt
        ab={zugangAb - 6}
        dauer={24}
        breite={6}
      />
      <Erscheinen
        ab={zugangAb + 18}
        art="skalieren"
        style={{ position: 'absolute', left: 1140, top: 180 }}
      >
        <Kreuz farbe={farben.fehler} groesse={90} />
      </Erscheinen>
      <Aussage x={1370} y={650} ab={zugangAb + 10} breite={940} groesse={42}>
        {t({
          de: 'Agenten brauchen keinen Zugang zum Cluster',
          en: 'Agents need no access to the cluster',
        })}
      </Aussage>
    </>
  )
}
