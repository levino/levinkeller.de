#import "../style.typ": *

#let title = "Sudoku"
#let rules = [
  Schreibe in jedes leere Kästchen eine Zahl. In jeder Zeile, in jeder Spalte und in jedem
  dick umrandeten Kasten steht jede Zahl genau einmal. Beim kleinen Sudoku sind das die
  Zahlen 1 bis 4, beim mittleren 1 bis 6 und beim großen 1 bis 9.
]
#let tip = [Suche eine Zeile, Spalte oder einen Kasten, in dem nur noch wenige Zahlen fehlen.
  Oder frage: „Wo in diesem Kasten kann die 3 überhaupt noch hin?“]
#let layout = (per-page: 4, width: 80mm, example-width: 50mm, solution-width: 40mm)

#let render(p, width: 104mm, solution: false) = {
  let d = p.data
  let n = d.size
  let (bh, bw) = d.box
  let regions = range(n).map(r => range(n).map(c => calc.floor(r / bh) * 10 + calc.floor(c / bw)))
  let cs0 = width / n
  board-grid(n, n, width,
    thin: (0.025 * cs0 + 0.2pt) + grid-line,
    thick: (0.09 * cs0 + 0.3pt) + ink,
    overlay: cs => region-borders(regions, cs, stroke: (0.07 * cs + 0.3pt) + ink),
    cell: (r, c, cs) => {
      let g = d.givens.at(r).at(c)
      if g != 0 { given-num(g, cs, scale: 0.6) }
      else if solution { sol-num(p.solution.grid.at(r).at(c), cs, scale: 0.6) }
      else { none }
    },
  )
}
