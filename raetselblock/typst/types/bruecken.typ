#import "../style.typ": *

#let title = "Brücken"
#let rules = [
  Verbinde die Inseln mit Brücken. Brücken gehen nur gerade waagerecht oder senkrecht
  von Insel zu Insel. Zwischen zwei Inseln dürfen höchstens *zwei* Brücken liegen, und
  Brücken kreuzen sich nie. Die Zahl sagt, wie viele Brücken an der Insel ankommen.
  Am Ende kann man über die Brücken von jeder Insel zu jeder anderen laufen.
]
#let tip = [Inseln mit großen Zahlen und wenigen Nachbarn zuerst: Eine 4 in der Ecke braucht zwei
  Doppelbrücken. Nie eine kleine Inselgruppe abschließen, die nicht mehr mit dem Rest verbunden ist.]
#let layout = (per-page: 4, width: 80mm, example-width: 52mm, solution-width: 42mm)

#let render(p, width: 104mm, solution: false) = {
  let d = p.data
  let W = d.w
  let H = d.h
  let cs = width / W
  let ctr(r, c) = ((c + 0.5) * cs, (r + 0.5) * cs)
  let rad = cs * 0.36
  box(width: width, height: H * cs, {
    // dezentes Punktraster (nur im Rätsel)
    if not solution { for r in range(H) {
      for c in range(W) {
        let (x, y) = ctr(r, c)
        place(top + left, dx: x - cs * 0.035, dy: y - cs * 0.035,
          circle(radius: cs * 0.035, fill: luma(200), stroke: none))
      }
    } }
    // Lösung: Brücken
    if solution {
      let th = calc.max(0.7pt, cs * 0.07)
      for b in p.solution.bridges {
        let a = d.islands.at(b.at(0))
        let e = d.islands.at(b.at(1))
        let (x1, y1) = ctr(a.at(0), a.at(1))
        let (x2, y2) = ctr(e.at(0), e.at(1))
        let horiz = a.at(0) == e.at(0)
        let offs = if b.at(2) == 2 { (-cs * 0.13, cs * 0.13) } else { (0pt,) }
        for o in offs {
          let (dx, dy) = if horiz { (0pt, o) } else { (o, 0pt) }
          place(top + left, line(start: (x1 + dx, y1 + dy), end: (x2 + dx, y2 + dy),
            stroke: (paint: sol-color, thickness: th, cap: "butt")))
        }
      }
    }
    // Inseln
    for isl in d.islands {
      let (x, y) = ctr(isl.at(0), isl.at(1))
      place(top + left, dx: x - rad, dy: y - rad,
        circle(radius: rad, fill: white, stroke: calc.max(0.7pt, cs * 0.05) + ink))
      place(top + left, dx: x - rad, dy: y - rad, box(width: 2 * rad, height: 2 * rad,
        align(center + horizon, text(size: cs * 0.42, weight: "bold", fill: ink, str(isl.at(2))))))
    }
  })
}
