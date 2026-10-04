#import "../style.typ": *

#let title = "Zahlenmauern"
#let rules = [
  Jeder Stein ist so groß wie die zwei Steine darunter zusammen: Im Kreis steht, ob du
  *plus* (+) oder *mal* (×) rechnen musst. Fülle alle leeren Steine aus. Manchmal fehlt
  ein Stein unten – dann rechnest du rückwärts: minus oder geteilt.
]
#let tip = [Suche immer ein Dreieck aus drei Steinen, bei dem schon zwei Zahlen stehen. Bei
  den schweren Mauern hilft: Bei einer Plus-Mauer mit 3 Reihen ist die Spitze = links + 2 × Mitte + rechts
  der untersten Reihe.]
#let layout = (per-page: 6, width: 80mm, example-width: 64mm, solution-width: 50mm)

#let plus-color = rgb("#e36414")
#let mal-color = rgb("#1d4ed8")

// Rechenzeichen im Kreis, gezeichnet (d = Durchmesser)
#let op-badge(op, d) = {
  let col = if op == "+" { plus-color } else { mal-color }
  box(width: d, height: d, {
    place(top + left, circle(radius: d / 2, fill: col))
    let st = (paint: white, thickness: d * 0.13, cap: "round")
    let a = d * 0.26
    let c = d / 2
    if op == "+" {
      place(top + left, line(start: (c - a, c), end: (c + a, c), stroke: st))
      place(top + left, line(start: (c, c - a), end: (c, c + a), stroke: st))
    } else {
      let b = a * 0.8
      place(top + left, line(start: (c - b, c - b), end: (c + b, c + b), stroke: st))
      place(top + left, line(start: (c - b, c + b), end: (c + b, c - b), stroke: st))
    }
  })
}

#let render(p, width: 80mm, solution: false) = {
  let d = p.data
  let n = d.rows
  let bw = width / calc.max(n, 4)
  let bh = bw * 0.64
  let x0 = (width - n * bw) / 2
  let col = if d.op == "+" { plus-color } else { mal-color }
  let lw = bw * 0.035 + 0.35pt
  let fs(v) = bh * 0.54 * (if v >= 100 { 0.86 } else { 1 })
  box(width: width, height: n * bh, {
    for r in range(n) {
      for i in range(r + 1) {
        let x = x0 + (n - 1 - r) * bw / 2 + i * bw
        let g = d.givens.at(r).at(i)
        let body = if g != 0 {
          text(size: fs(g), weight: "bold", fill: ink, str(g))
        } else if solution {
          let s = p.solution.values.at(r).at(i)
          text(size: fs(s), weight: "medium", fill: sol-color, str(s))
        } else { none }
        place(top + left, dx: x, dy: r * bh,
          rect(width: bw, height: bh, inset: 0pt,
            fill: if g != 0 { col.lighten(86%) } else { white },
            stroke: lw + ink,
            align(center + horizon, body)))
      }
    }
    // Rechenzeichen oben links neben der Spitze
    let dd = if n >= 4 { bh * 1.45 } else { bh * 0.96 }
    let dy = if n >= 4 { bh * 0.12 } else { bh * 0.02 }
    place(top + left, dx: x0 + (bw - dd) / 2 - bw * 0.05, dy: dy, op-badge(d.op, dd))
  })
}
