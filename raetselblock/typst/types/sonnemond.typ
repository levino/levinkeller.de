#import "../style.typ": *

#let title = "Sonne & Mond"
#let rules = [
  Male in jedes Kästchen eine Sonne oder einen Mond. In jeder Reihe und jeder Spalte gibt es
  gleich viele Sonnen wie Monde. Nie mehr als zwei gleiche direkt nebeneinander oder untereinander.
  Steht „=“ zwischen zwei Kästchen, sind sie gleich – steht „×“ dazwischen, sind sie verschieden.
]
#let tip = [Zwei gleiche nebeneinander? Dann muss daneben das andere Zeichen stehen. Eine Lücke
  zwischen zwei gleichen wird mit dem anderen gefüllt. Ist eine Reihe zur Hälfte voll mit einem Zeichen,
  ist der Rest das andere.]
#let layout = (per-page: 4, width: 76mm, example-width: 50mm, solution-width: 34mm)

#let sign-mark(s, cs) = {
  let d = cs * 0.36
  box(width: d, height: d, {
    place(top + left, circle(radius: d / 2, fill: white, stroke: (cs * 0.025) + luma(150)))
    place(top + left, box(width: d, height: d, align(center + horizon,
      text(size: cs * 0.3, weight: "bold", fill: ink, if s == "=" { "=" } else { "×" }))))
  })
}

#let render(p, width: 96mm, solution: false) = {
  let d = p.data
  let n = d.size
  let given = (:)
  for g in d.givens { given.insert(str(g.at(0)) + "-" + str(g.at(1)), g.at(2)) }
  let symb(v, s, faded, bg: white) = if v == 0 {
    sun(s, fill: if faded { rgb("#f4a300").lighten(30%) } else { rgb("#f4a300") })
  } else {
    moon(s, bg: bg, fill: if faded { rgb("#3b4cca").lighten(35%) } else { rgb("#3b4cca") })
  }
  let cs = width / n
  box(width: width, height: width, {
  place(top + left, board-grid(n, n, width,
    thin: (0.25mm + width / 700) + grid-line,
    thick: (0.5mm + width / 180) + ink,
    fill: (r, c) => if solution and (str(r) + "-" + str(c)) in given { luma(232) } else { none },
    cell: (r, c, cs) => {
      let k = str(r) + "-" + str(c)
      if k in given { symb(given.at(k), cs * 0.62, false, bg: if solution { luma(232) } else { white }) }
      else if solution { symb(p.solution.grid.at(r).at(c), cs * 0.5, true) }
      else { none }
    },
  ))
  for s in d.signs {
    let (r1, c1, r2, c2, t) = s
    let x = (c1 + c2 + 1) / 2 * cs
    let y = (r1 + r2 + 1) / 2 * cs
    let m = cs * 0.36
    place(top + left, dx: x - m / 2, dy: y - m / 2, sign-mark(t, cs))
  }
  })
}
