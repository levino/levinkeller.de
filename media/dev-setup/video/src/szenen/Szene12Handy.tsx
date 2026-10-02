import type React from 'react'
import {
  Erscheinen,
  einblenden,
  Linie,
  Terminal,
  type Text,
  useSzene,
} from '../bausteine'
import { farben, schriften } from '../gestaltung'
import { Fingerabdruck, Haken, Kreuz, Laptop, Mikrofon } from '../symbole'

const Blase: React.FC<{
  ab: number
  von: 'agent' | 'ich'
  text: Text
  symbol?: React.ReactNode
}> = ({ ab, von, text, symbol }) => {
  const { t } = useSzene()
  const ich = von === 'ich'
  return (
    <Erscheinen
      ab={ab}
      style={{
        display: 'flex',
        justifyContent: ich ? 'flex-end' : 'flex-start',
        marginTop: 18,
      }}
    >
      <div
        style={{
          maxWidth: 330,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 18px',
          borderRadius: 22,
          background: ich ? farben.handy : farben.flaecheHell,
          color: ich ? farben.grund : farben.text,
          fontFamily: schriften.text,
          fontSize: 27,
          lineHeight: 1.25,
          fontWeight: ich ? 650 : 450,
        }}
      >
        {symbol}
        <span>{t(text)}</span>
      </div>
    </Erscheinen>
  )
}

export const Szene12Handy: React.FC = () => {
  const { bild, t, bei } = useSzene()
  const keinSshAb = bei({ de: 'kein SSH', en: "don't use SSH" })
  const remoteAb = bei('Remote Control')
  const appAb = bei({ de: 'Claude-App', en: 'Claude app' })
  const sehenAb = bei({ de: 'sehen, was', en: 'see what' })
  const fragenAb = bei({ de: 'Fragen beantworten', en: 'answer its questions' })
  const aufgabeAb = bei({ de: 'nächste Aufgabe', en: 'next task' })
  const spracheAb = bei({ de: 'Spracheingabe', en: 'by voice' })
  const schluesselAb = bei({ de: 'SSH-Schlüssel', en: 'SSH key' })
  return (
    <>
      {/* Laufende Sitzung in der Drohne */}
      <Terminal
        x={80}
        y={220}
        w={640}
        h={420}
        titel="claude · hatchery-levino-shipyard"
        ab={4}
        farbe={farben.agent}
        schrift={27}
        zeilen={[
          { text: '● Edit src/search.ts', ab: 14, farbe: farben.text },
          { text: '● npm test', ab: 34, farbe: farben.text },
          { text: '✓ 42 passed', ab: 54, farbe: farben.deploy },
          {
            text: 'Remote Control: on',
            ab: remoteAb - 4,
            farbe: farben.handy,
          },
          {
            text: t({ de: '→ verbunden', en: '→ connected' }),
            ab: remoteAb + 18,
            farbe: farben.handy,
          },
        ]}
      />
      <Erscheinen
        ab={keinSshAb}
        style={{
          position: 'absolute',
          left: 80,
          top: 690,
          width: 640,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Kreuz farbe={farben.fehler} groesse={50} />
        <div
          style={{
            fontFamily: schriften.text,
            fontSize: 34,
            color: farben.gedaempft,
          }}
        >
          {t({
            de: 'kein SSH-Terminal auf dem Handy',
            en: 'no SSH terminal on the phone',
          })}
        </div>
      </Erscheinen>
      <Linie
        von={[730, 430]}
        nach={[860, 430]}
        farbe={farben.handy}
        ab={remoteAb}
        breite={8}
      />

      {/* Das Handy */}
      <Erscheinen
        ab={appAb - 10}
        art="skalieren"
        style={{
          position: 'absolute',
          left: 880,
          top: 170,
          width: 420,
          height: 830,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            border: `8px solid ${farben.handy}`,
            borderRadius: 56,
            background: '#090e1b',
            padding: '40px 22px',
            boxShadow: `0 0 50px ${farben.handy}55`,
          }}
        >
          <div
            style={{
              fontFamily: schriften.text,
              fontWeight: 800,
              fontSize: 30,
              color: farben.text,
              textAlign: 'center',
              paddingBottom: 14,
              borderBottom: `2px solid ${farben.rand}`,
            }}
          >
            Claude
            <div
              style={{
                fontFamily: schriften.mono,
                fontSize: 22,
                color: farben.gedaempft,
                fontWeight: 400,
              }}
            >
              shipyard
            </div>
          </div>
          <Blase
            ab={sehenAb}
            von="agent"
            text={{
              de: 'Tests grün. Suche ist fertig.',
              en: 'Tests green. Search is done.',
            }}
          />
          <Blase
            ab={fragenAb - 6}
            von="agent"
            text={{
              de: 'Soll ich den PR öffnen?',
              en: 'Shall I open the PR?',
            }}
          />
          <Blase
            ab={fragenAb + 10}
            von="ich"
            text={{ de: 'Ja.', en: 'Yes.' }}
          />
          <Blase
            ab={spracheAb - 4}
            von="ich"
            symbol={<Mikrofon farbe={farben.grund} groesse={32} />}
            text={{
              de: 'Danach: Doku zur Suche schreiben.',
              en: 'Then: write the docs for search.',
            }}
          />
        </div>
      </Erscheinen>

      {/* Was man unterwegs tut */}
      {[
        {
          ab: sehenAb,
          text: { de: 'sehen, was er tut', en: 'see what it does' },
        },
        {
          ab: fragenAb,
          text: { de: 'Fragen beantworten', en: 'answer questions' },
        },
        {
          ab: aufgabeAb,
          text: { de: 'nächste Aufgabe geben', en: 'give the next task' },
        },
      ].map((punkt, index) => (
        <Erscheinen
          key={punkt.text.en}
          ab={punkt.ab}
          style={{
            position: 'absolute',
            left: 1380,
            top: 260 + index * 100,
            width: 470,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontFamily: schriften.text,
              fontSize: 36,
              color: farben.text,
            }}
          >
            <Haken farbe={farben.handy} groesse={46} />
            {t(punkt.text)}
          </div>
        </Erscheinen>
      ))}

      {/* Der Haken an der Sache */}
      <Erscheinen
        ab={schluesselAb}
        art="skalieren"
        style={{ position: 'absolute', left: 1380, top: 640, width: 460 }}
      >
        <div
          style={{
            background: farben.flaeche,
            border: `4px solid ${farben.mensch}`,
            borderRadius: 24,
            padding: '22px 26px',
            fontFamily: schriften.text,
            color: farben.text,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 32,
              fontWeight: 750,
            }}
          >
            <Fingerabdruck farbe={farben.mensch} groesse={54} />
            {t({ de: 'SSH-Schlüssel?', en: 'SSH key?' })}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 12,
              fontSize: 30,
              color: farben.mensch,
              opacity: einblenden(bild, schluesselAb + 14),
            }}
          >
            <Laptop farbe={farben.mensch} groesse={40} />
            {t({ de: 'nur am Mac bestätigen', en: 'confirm on the Mac only' })}
          </div>
        </div>
      </Erscheinen>
    </>
  )
}
