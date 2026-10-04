#import "../style.typ": *

#let title = "Verbinden"
#let rules = [
  Verbinde jeweils die zwei gleichen Buchstaben mit einer Linie. Die Linien gehen nur
  waagerecht und senkrecht von Kästchenmitte zu Kästchenmitte und kreuzen sich nie.
  Am Ende ist *jedes* Kästchen benutzt.
]
#let tip = [Fang an Ecken und Rändern an – dort gibt es oft nur einen Weg.]
#let layout = (per-page: 4, width: 80mm, example-width: 52mm, solution-width: 36mm)

#let render(p, width: 112mm, solution: false) = {
  let d = p.data
  let n = d.size
  board-grid(n, n, width,
    underlay: cs => if solution {
      for (k, cells) in p.solution.paths {
        let pts = cells.map(c => ((c.at(1) + 0.5) * cs, (c.at(0) + 0.5) * cs))
        place(top + left, curve(
          stroke: (paint: letter-color(k).lighten(45%), thickness: cs * 0.34, cap: "round", join: "round"),
          curve.move(pts.at(0)), ..pts.slice(1).map(pt => curve.line(pt))))
      }
    },
    cell: (r, c, cs) => {
      for (k, ends) in d.ends {
        for e in ends {
          if e.at(0) == r and e.at(1) == c {
            return text(size: cs * 0.6, weight: "bold", fill: letter-color(k), k)
          }
        }
      }
      none
    },
  )
}
