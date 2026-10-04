#import "../style.typ": *

#let title = "Kreuzsummen"
#let rules = [
  Schreibe in jedes weiße Kästchen eine Zahl von 1 bis 9. Die Zahl im grauen Feld oben rechts
  ist die Summe der Kästchen rechts daneben, die Zahl unten links die Summe der Kästchen darunter.
  In einem Streifen darf keine Zahl doppelt vorkommen.
]
#let tip = [Fang mit kleinen oder großen Summen an: 3 geht nur als 1 + 2, 4 nur als 1 + 3,
  17 in zwei Kästchen nur als 8 + 9. Wo sich zwei solche Streifen kreuzen, steht oft sofort die Zahl fest.]
#let layout = (per-page: 4, width: 78mm, example-width: 50mm, solution-width: 40mm)

#let clue-fill = luma(85)

#let render(p, width: 98mm, solution: false) = {
  let d = p.data
  let n = d.size
  let cs = width / n
  let lw = calc.max(0.5pt, cs * 0.03)
  let given = (:)
  for g in d.at("givens", default: ()) { given.insert(str(g.at(0)) + "-" + str(g.at(1)), g.at(2)) }
  board-grid(n, n, width,
    thin: (lw * 1.2) + ink,
    thick: (lw * 3) + ink,
    fill: (r, c) => if d.cells.at(r).at(c) != 0 { clue-fill } else { none },
    overlay: cs => {
      for r in range(n) {
        for c in range(n) {
          let cl = d.cells.at(r).at(c)
          if cl == 0 { continue }
          let down = cl.at(0)
          let right = cl.at(1)
          if down == 0 and right == 0 { continue }
          let x0 = c * cs
          let y0 = r * cs
          place(top + left, line(start: (x0, y0), end: (x0 + cs, y0 + cs), stroke: (lw * 1.3) + white))
          let fs = cs * 0.32
          if right != 0 {
            place(top + left, dx: x0 + cs * 0.46, dy: y0 + cs * 0.04,
              box(width: cs * 0.5, height: cs * 0.42,
                align(center + horizon, text(size: fs, weight: "bold", fill: white, str(right)))))
          }
          if down != 0 {
            place(top + left, dx: x0 + cs * 0.04, dy: y0 + cs * 0.54,
              box(width: cs * 0.5, height: cs * 0.42,
                align(center + horizon, text(size: fs, weight: "bold", fill: white, str(down)))))
          }
        }
      }
    },
    cell: (r, c, cs) => {
      if d.cells.at(r).at(c) != 0 { return none }
      let key = str(r) + "-" + str(c)
      if key in given { given-num(given.at(key), cs, scale: 0.55) }
      else if solution { sol-num(p.solution.grid.at(r).at(c), cs, scale: 0.55) }
      else { none }
    },
  )
}
