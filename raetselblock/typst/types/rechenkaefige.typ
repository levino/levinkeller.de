#import "../style.typ": *

#let title = "Rechenkäfige"
#let rules = [
  Schreibe in jede Zeile und in jede Spalte jede Zahl genau einmal – bei 4 Kästchen pro
  Zeile die Zahlen 1 bis 4, bei 5 Kästchen 1 bis 5 und so weiter. Die dicken Linien bilden
  Käfige. Die kleine Zahl oben links sagt dir, was herauskommt, wenn du die Zahlen im Käfig
  mit dem Rechenzeichen verrechnest: + plus, − minus, × mal, ÷ geteilt.
  Bei − und ÷ nimmst du die größere Zahl minus oder geteilt durch die kleinere.
  Steht eine Zahl allein in einem Käfig, ist sie schon verraten.
]
#let tip = [Fang mit Käfigen an, für die es nur eine Möglichkeit gibt (z. B. „3+“ aus zwei
  Kästchen ist immer 1 und 2). Im Käfig darf eine Zahl doppelt vorkommen, wenn die beiden
  Kästchen nicht in derselben Zeile oder Spalte liegen.]
#let layout = (per-page: 2, width: 100mm, example-width: 60mm, solution-width: 50mm)

#let render(p, width: 100mm, solution: false) = {
  let d = p.data
  let n = d.size
  let cs0 = width / n
  // Käfig-Nummer je Zelle
  let regions = range(n).map(r => range(n).map(c => 0))
  for (k, cage) in d.cages.enumerate() {
    for cell in cage.cells { regions.at(cell.at(0)).at(cell.at(1)) = k }
  }
  // Clue-Position: oberste, dann linkeste Zelle des Käfigs
  let clue = (:)
  let single = (:)
  for cage in d.cages {
    let first = cage.cells.sorted(key: rc => rc.at(0) * 100 + rc.at(1)).first()
    let key = str(first.at(0)) + "-" + str(first.at(1))
    if cage.op == "" {
      single.insert(key, cage.target)
    } else {
      clue.insert(key, str(cage.target) + cage.op)
    }
  }
  board-grid(n, n, width,
    thin: (0.02 * cs0 + 0.2pt) + grid-line.lighten(20%),
    thick: (0.08 * cs0 + 0.4pt) + ink,
    overlay: cs => {
      region-borders(regions, cs, stroke: (0.065 * cs + 0.4pt) + ink)
      for (key, t) in clue {
        let (r, c) = key.split("-").map(int)
        place(top + left, dx: c * cs + cs * 0.08, dy: r * cs + cs * 0.07,
          text(size: cs * 0.22, weight: "bold", fill: ink, top-edge: "cap-height", bottom-edge: "baseline", t))
      }
    },
    cell: (r, c, cs) => {
      let key = str(r) + "-" + str(c)
      let v = p.solution.grid.at(r).at(c)
      if key in single {
        given-num(single.at(key), cs, scale: 0.5)
      } else if solution {
        // etwas tiefer setzen, damit die Zielzahl frei bleibt
        move(dy: if key in clue { cs * 0.1 } else { 0pt }, sol-num(v, cs, scale: 0.5))
      } else { none }
    },
  )
}
