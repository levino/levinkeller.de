#import "../style.typ": *

#let title = "Symbolrätsel"
#let rules = [
  Jede Form steht für eine Zahl – gleiche Formen sind immer gleich viel wert, verschiedene
  Formen sind verschieden. Finde heraus, welche Zahl hinter jeder Form steckt, und schreibe
  sie unten in die Kästchen. Dann rechne die gelbe Zeile aus.
]
#let tip = [Gerechnet wird in jeder Zeile von links nach rechts. Beginne mit einer Zeile, in der
  nur eine Form vorkommt. Bei den schweren Rätseln muss man zwei Zeilen zusammen ansehen,
  z. B. „Herz + Stern = 10“ und „Herz − Stern = 4“: probiere Paare, die 10 ergeben.]
#let layout = (per-page: 4, width: 84mm, example-width: 66mm, solution-width: 50mm)

// Herz lokal gezeichnet (klassische Herzform), alle anderen Formen aus style.typ
#let heart2(s, fill: rgb("#d63384")) = box(width: s, height: s, {
  let P(x, y) = (x * s, y * s)
  place(top + left, curve(fill: fill,
    curve.move(P(0.5, 0.9)),
    curve.cubic(P(0.24, 0.72), P(0.05, 0.55), P(0.07, 0.35)),
    curve.cubic(P(0.09, 0.13), P(0.4, 0.06), P(0.5, 0.27)),
    curve.cubic(P(0.6, 0.06), P(0.91, 0.13), P(0.93, 0.35)),
    curve.cubic(P(0.95, 0.55), P(0.76, 0.72), P(0.5, 0.9)),
    curve.close(mode: "straight")))
})
#let shape(name, s) = if name == "herz" { heart2(s) } else { symbol(name, s) }

#let op-sym(o) = if o == "+" { "+" } else if o == "-" { "−" } else if o == "*" { "×" } else { "÷" }

#let render(p, width: 84mm, solution: false) = {
  let d = p.data
  let s = width / 9.4          // Formgröße
  let rowh = s * 1.32
  let opw = s * 0.66
  let eqw = s * 0.72
  let resw = s * 1.6
  let lines = d.equations + (d.question,)
  let maxt = calc.max(..lines.map(l => l.terms.len()))
  let blockw = maxt * s + (maxt - 1) * opw + eqw + resw
  let bx = (width - blockw) / 2
  let lw = s * 0.06 + 0.3pt
  let num-size = s * 0.64
  let numtxt(v, col: ink, w: "bold") = text(size: num-size * (if v >= 100 { 0.85 } else { 1 }), weight: w, fill: col, str(v))
  let wbox(w, h, body) = box(width: w, height: h, radius: s * 0.14, stroke: lw + ink, fill: white,
    align(center + horizon, body))

  let row(l, q) = box(width: width, height: rowh, {
    if q {
      place(top + left, dx: bx - s * 0.25, dy: 0pt,
        rect(width: blockw + s * 0.5, height: rowh, radius: s * 0.2, fill: rgb("#fff3b0"), stroke: none))
    }
    let nt = l.terms.len()
    let xe = bx + maxt * s + (maxt - 1) * opw
    let x = xe - (nt * s + (nt - 1) * opw)
    for (j, t) in l.terms.enumerate() {
      place(top + left, dx: x, dy: (rowh - s) / 2, shape(t, s))
      x += s
      if j < nt - 1 {
        place(top + left, dx: x, dy: 0pt, box(width: opw, height: rowh,
          align(center + horizon, text(size: s * 0.72, weight: "bold", fill: ink, op-sym(l.ops.at(j))))))
        x += opw
      }
    }
    place(top + left, dx: xe, dy: 0pt, box(width: eqw, height: rowh,
      align(center + horizon, text(size: s * 0.72, weight: "bold", fill: ink, "="))))
    let rx = xe + eqw
    if q {
      place(top + left, dx: rx + s * 0.05, dy: (rowh - s * 1.08) / 2,
        wbox(resw - s * 0.1, s * 1.08, if solution { numtxt(p.solution.answer, col: sol-color, w: "medium") }))
    } else {
      place(top + left, dx: rx, dy: 0pt, box(width: resw, height: rowh,
        align(center + horizon, numtxt(l.result))))
    }
  })

  // Eintrage-Reihe: Form = Kästchen
  let k = d.shapes.len()
  let cols = if k <= 3 { k } else { 2 }
  let ss = s * 0.82
  let itw = ss + s * 0.55 + s * 1.3
  let gap = s * 0.7
  let item(t) = box(width: itw, height: s * 1.15, {
    place(top + left, dx: 0pt, dy: (s * 1.15 - ss) / 2, shape(t, ss))
    place(top + left, dx: ss, dy: 0pt, box(width: s * 0.55, height: s * 1.15,
      align(center + horizon, text(size: s * 0.6, weight: "bold", fill: ink, "="))))
    place(top + left, dx: ss + s * 0.55, dy: s * 0.04,
      wbox(s * 1.3, s * 1.07, if solution { numtxt(p.solution.values.at(t), col: sol-color, w: "medium") }))
  })

  box(width: width, {
    for l in d.equations { row(l, false) }
    v(s * 0.12)
    row(d.question, true)
    v(s * 0.3)
    line(length: width, stroke: (paint: luma(170), thickness: lw * 0.8, dash: "dashed"))
    v(s * 0.3)
    align(center, grid(columns: (itw,) * cols, column-gutter: gap, row-gutter: s * 0.3,
      ..d.shapes.map(item)))
  })
}
