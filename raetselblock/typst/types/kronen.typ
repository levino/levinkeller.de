#import "../style.typ": *

#let title = "Kronen"
#let rules = [
  Setze Kronen in die Kästchen: In jeder Reihe, in jeder Spalte und in jedem farbigen
  Gebiet steht *genau eine* Krone. Zwei Kronen dürfen sich nie berühren – auch nicht
  schräg an der Ecke.
]
#let tip = [Mit einem Kreuz markieren, wo keine Krone hin kann. Kleine Gebiete zuerst anschauen –
  liegt ein Gebiet ganz in einer Reihe, ist der Rest dieser Reihe kronenfrei.]
#let layout = (per-page: 2, width: 106mm, example-width: 62mm, solution-width: 40mm)

#let render(p, width: 106mm, solution: false) = {
  let d = p.data
  let n = d.size
  let reg = d.regions
  let crowns = if solution { p.solution.crowns } else { () }
  board-grid(n, n, width,
    fill: (r, c) => pastel(reg.at(r).at(c)),
    thin: (0.25mm + width / 800) + grid-line,
    thick: (0.5mm + width / 160) + ink,
    overlay: cs => region-borders(reg, cs, stroke: (0.4mm + width / 220) + ink),
    cell: (r, c, cs) => {
      if crowns.any(x => x.at(0) == r and x.at(1) == c) { crown(cs * 0.78) } else { none }
    },
  )
}
