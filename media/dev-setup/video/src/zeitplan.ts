import stimme from '../stimme.json'
import szenenDe from './daten/szenen.de.json'
import szenenEn from './daten/szenen.en.json'

export type Sprache = 'de' | 'en'
export const bilderProSekunde = 30

type SzenenDaten = { nummer: number; titel: string; text: string; dauer: number | null }

export type SzenenZeit = SzenenDaten & {
  /** Bild innerhalb der Szene, an dem die Stimme einsetzt */
  audioBeginn: number
  /** Sprechdauer in Bildern */
  audioBilder: number
  audioDatei: string
  beginn: number
  dauerInBildern: number
}

const daten: Record<Sprache, SzenenDaten[]> = { de: szenenDe, en: szenenEn }

/** Ohne Vertonung (z. B. im Studio vor dem ersten Lauf) eine Schätzung aus der Textlänge */
const geschaetzteDauer = (text: string) => text.length / 15

export function szenenZeiten(sprache: Sprache): SzenenZeit[] {
  const szenen = daten[sprache]
  let beginn = 0
  return szenen.map((szene, index) => {
    const sprechdauer = szene.dauer ?? geschaetzteDauer(szene.text)
    const abspann = index === szenen.length - 1 ? stimme.abspannHaltenInSekunden : 0
    const dauerInBildern = Math.ceil(
      (stimme.luftVorSzeneInSekunden + sprechdauer + stimme.luftNachSzeneInSekunden + abspann) * bilderProSekunde
    )
    const zeit: SzenenZeit = {
      ...szene,
      audioBeginn: Math.round(stimme.luftVorSzeneInSekunden * bilderProSekunde),
      audioBilder: Math.ceil(sprechdauer * bilderProSekunde),
      audioDatei: `stimme/${sprache}/szene-${String(szene.nummer).padStart(2, '0')}.mp3`,
      beginn,
      dauerInBildern,
    }
    beginn += dauerInBildern
    return zeit
  })
}

export const gesamtdauer = (sprache: Sprache) =>
  szenenZeiten(sprache).reduce((summe, szene) => summe + szene.dauerInBildern, 0)
