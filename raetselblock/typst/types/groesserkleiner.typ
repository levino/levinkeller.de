#import "../style.typ": *

#let title = "Größer – Kleiner"
#let rules = [
  Schreibe in jede Zeile und in jede Spalte jede Zahl genau einmal – bei 4 Kästchen pro
  Zeile die Zahlen 1 bis 4, bei 5 Kästchen 1 bis 5 und so weiter. Die Zeichen zwischen
  zwei Kästchen sind wie ein Krokodilmaul: Die Spitze zeigt immer auf die kleinere Zahl,
  die offene Seite auf die größere. Das gilt auch für die Zeichen zwischen Kästchen, die
  übereinander stehen.
]
#let tip = [Eine Zahl, auf die eine Spitze zeigt, kann nie die größte sein; eine Zahl an der
  offenen Seite nie die 1. Ketten wie 1 < 2 < 3 helfen besonders.]
#let layout = (per-page: 4, width: 76mm, example-width: 52mm, solution-width: 40mm)

#let gap-ratio = 0.42

// Winkel als zwei Linien. (x, y) = Mitte, s = Größe, dir = Richtung der Spitze
#let chevron(x, y, s, dir, stroke) = {
  let a = s * 0.32   // halbe Öffnung
  let b = s * 0.2    // halbe Tiefe
  let pts = if dir == "left" { ((x + b, y - a), (x - b, y), (x + b, y + a)) }
    else if dir == "right" { ((x - b, y - a), (x + b, y), (x - b, y + a)) }
    else if dir == "up" { ((x - a, y + b), (x, y - b), (x + a, y + b)) }
    else { ((x - a, y - b), (x, y + b), (x + a, y - b)) }
  place(top + left, curve(stroke: stroke, curve.move(pts.at(0)), curve.line(pts.at(1)), curve.line(pts.at(2))))
}

#let render(p, width: 100mm, solution: false) = {
  let d = p.data
  let n = d.size
  let cs = width / (n + (n - 1) * gap-ratio)
  let g = cs * gap-ratio
  let step = cs + g
  let st = (paint: ink, thickness: cs * 0.065 + 0.3pt, cap: "round", join: "round")
  box(width: width, height: width, {
    for r in range(n) {
      for c in range(n) {
        let x = c * step
        let y = r * step
        place(top + left, dx: x, dy: y,
          rect(width: cs, height: cs, radius: cs * 0.12, stroke: (cs * 0.035 + 0.3pt) + ink.lighten(15%), fill: white))
        let v = d.givens.at(r).at(c)
        let body = if v != 0 { given-num(v, cs, scale: 0.58) }
          else if solution { sol-num(p.solution.grid.at(r).at(c), cs, scale: 0.58) }
          else { none }
        if body != none {
          place(top + left, dx: x, dy: y, box(width: cs, height: cs, align(center + horizon, body)))
        }
      }
    }
    for s in d.signs {
      let (r, c, dir, rel) = s
      if dir == "h" {
        let x = c * step + cs + g / 2
        let y = r * step + cs / 2
        chevron(x, y, g * 1.1, if rel == "<" { "left" } else { "right" }, st)
      } else {
        let x = c * step + cs / 2
        let y = r * step + cs + g / 2
        chevron(x, y, g * 1.1, if rel == "<" { "up" } else { "down" }, st)
      }
    }
  })
}
