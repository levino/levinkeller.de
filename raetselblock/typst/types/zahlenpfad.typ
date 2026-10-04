#import "../style.typ": *

#let title = "Zahlenpfad"
#let rules = [
  Zeichne *eine* Linie: Sie beginnt bei der 1 und besucht die Zahlen der Reihe nach – 1, 2, 3 … –
  bis zur größten Zahl. Die Linie geht nur waagerecht und senkrecht von Kästchen zu Kästchen und muss
  durch *jedes* Kästchen genau einmal. Durch dicke Wände darf sie nicht.
]
#let tip = [Ecken und Felder an Wänden haben nur wenige Nachbarn – dort ist der Weg oft schon
  festgelegt. Die Linie darf keine Ecke „vergessen“, sonst ist sie dort in einer Sackgasse.]
#let layout = (per-page: 4, width: 78mm, example-width: 50mm, solution-width: 36mm)

#let render(p, width: 100mm, solution: false) = {
  let d = p.data
  let n = d.size
  let line-col = rgb("#e36414")
  board-grid(n, n, width,
    thin: (0.25mm + width / 700) + grid-line,
    thick: (0.5mm + width / 180) + ink,
    underlay: cs => if solution {
      let pts = p.solution.path.map(c => ((c.at(1) + 0.5) * cs, (c.at(0) + 0.5) * cs))
      place(top + left, curve(
        stroke: (paint: line-col.lighten(35%), thickness: cs * 0.26, cap: "round", join: "round"),
        curve.move(pts.at(0)), ..pts.slice(1).map(pt => curve.line(pt))))
    },
    overlay: cs => {
      let ws = (0.6mm + width / 110) + ink
      for w in d.walls {
        let (r1, c1, r2, c2) = w
        if r1 == r2 {
          let x = calc.max(c1, c2) * cs
          place(top + left, line(start: (x, r1 * cs), end: (x, (r1 + 1) * cs),
            stroke: (paint: ink, thickness: ws.thickness, cap: "round")))
        } else {
          let y = calc.max(r1, r2) * cs
          place(top + left, line(start: (c1 * cs, y), end: ((c1 + 1) * cs, y),
            stroke: (paint: ink, thickness: ws.thickness, cap: "round")))
        }
      }
    },
    cell: (r, c, cs) => {
      for cl in d.clues {
        if cl.at(0) == r and cl.at(1) == c {
          let v = cl.at(2)
          let rad = cs * 0.33
          return box(width: 2 * rad, height: 2 * rad, {
            place(top + left, circle(radius: rad, fill: ink))
            place(top + left, box(width: 2 * rad, height: 2 * rad, align(center + horizon,
              text(size: cs * (if v >= 10 { 0.33 } else { 0.4 }), weight: "bold", fill: white, str(v)))))
          })
        }
      }
      none
    },
  )
}
