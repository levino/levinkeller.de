#import "../style.typ": *

#let title = "Zauberquadrate"
#let rules = [
  Schreibe die Zahlen aus der Reihe unten in die leeren Kästchen – jede Zahl genau einmal.
  Jede Zeile, jede Spalte und die zwei schrägen Linien (den Pfeilen nach) ergeben zusammengezählt
  dieselbe Zauberzahl. Sie steht im Kreis. Steht dort ein Fragezeichen, musst du sie
  zuerst selbst finden.
]
#let tip = [Zuerst eine Linie suchen, in der nur ein Kästchen fehlt. Fehlen zwei, überlege, welche
  zwei der übrigen Zahlen zusammen passen. Unten benutzte Zahlen durchstreichen. Beim 3×3-Quadrat
  steht in der Mitte immer ein Drittel der Zauberzahl.]
#let layout = (per-page: 4, width: 80mm, example-width: 64mm, solution-width: 50mm)

#let magic-color = rgb("#6d28d9")

#let arrow(x1, y1, x2, y2, st, head) = {
  place(top + left, line(start: (x1, y1), end: (x2, y2), stroke: st))
  let dx = x2 - x1
  let dy = y2 - y1
  let len = calc.sqrt(calc.pow(dx / 1pt, 2) + calc.pow(dy / 1pt, 2)) * 1pt
  let ux = dx / len
  let uy = dy / len
  let bx = x2 + ux * head * 0.35
  let by = y2 + uy * head * 0.35
  place(top + left, polygon(fill: st.paint, stroke: none,
    (bx, by),
    (bx - ux * head + uy * head * 0.55, by - uy * head - ux * head * 0.55),
    (bx - ux * head - uy * head * 0.55, by - uy * head + ux * head * 0.55)))
}

#let render(p, width: 78mm, solution: false) = {
  let d = p.data
  let n = d.size
  let cs = width / (n + 1.5)
  let lm = cs * 0.5                       // linker Rand (für die Pfeil der Gegendiagonale)
  let G = n * cs
  let shown = if d.sum != 0 { d.sum } else if solution { p.solution.sum } else { none }
  let ast = (paint: magic-color, thickness: cs * 0.05 + 0.3pt, cap: "round")
  let head = cs * 0.16
  let nums = d.numbers
  let perrow = if nums.len() > 9 { 8 } else { nums.len() }
  let nrows = calc.ceil(nums.len() / perrow)
  let pitch = calc.min(width / perrow, cs * 0.9)
  let card = pitch * 0.82
  let pool-y = G + cs + cs * 0.22
  let nrows = if solution { 0 } else { nrows }
  let used = d.givens.flatten().filter(v => v != 0)
  box(width: width, height: if solution { G + cs } else { pool-y + nrows * pitch }, {
    place(top + left, dx: lm, dy: 0pt, board-grid(n, n, G,
      thin: (0.03 * cs + 0.3pt) + grid-line,
      thick: (0.07 * cs + 0.4pt) + ink,
      fill: (r, c) => if d.givens.at(r).at(c) != 0 { luma(236) } else { none },
      cell: (r, c, cs) => {
        let g = d.givens.at(r).at(c)
        if g != 0 { given-num(g, cs, scale: 0.5) }
        else if solution { sol-num(p.solution.grid.at(r).at(c), cs, scale: 0.5) }
        else { none }
      }))
    // Pfeile: Zeilen nach rechts, Spalten nach unten, Diagonalen schräg
    for i in range(n) {
      let y = (i + 0.5) * cs
      arrow(lm + G + cs * 0.1, y, lm + G + cs * 0.42, y, ast, head)
      let x = lm + (i + 0.5) * cs
      arrow(x, G + cs * 0.1, x, G + cs * 0.42, ast, head)
    }
    arrow(lm + G + cs * 0.05, G + cs * 0.05, lm + G + cs * 0.15, G + cs * 0.15, ast, head)
    arrow(lm - cs * 0.06, G + cs * 0.06, lm - cs * 0.3, G + cs * 0.3, ast, head)
    // Zauberzahl im Kreis
    let dd = cs * 0.86
    let cx = lm + G + cs * 0.56
    place(top + left, dx: cx - dd / 2, dy: cx - lm - dd / 2,
      box(width: dd, height: dd, {
        place(top + left, circle(radius: dd / 2, fill: magic-color.lighten(88%), stroke: (cs * 0.07 + 0.3pt) + magic-color))
        place(top + left, box(width: dd, height: dd, align(center + horizon,
          if shown != none {
            text(size: dd * (if shown >= 100 { 0.36 } else { 0.42 }), weight: "black",
              fill: if d.sum == 0 { sol-color } else { magic-color }, str(shown))
          } else {
            text(size: dd * 0.5, weight: "black", fill: magic-color, "?")
          })))
      }))
    // Zahlenvorrat
    let x0 = (width - perrow * pitch) / 2
    for (k, v) in (if solution { () } else { nums }).enumerate() {
      let r = calc.floor(k / perrow)
      let c = calc.rem(k, perrow)
      let isg = v in used
      place(top + left, dx: x0 + c * pitch + (pitch - card) / 2, dy: pool-y + r * pitch,
        box(width: card, height: card, radius: card * 0.18,
          fill: if isg { luma(225) } else { rgb("#f3eefc") },
          stroke: (card * 0.04 + 0.2pt) + (if isg { luma(160) } else { magic-color.lighten(30%) }),
          align(center + horizon, text(size: card * 0.48, weight: "bold",
            fill: if isg { luma(140) } else { ink }, str(v)))))
      if isg {
        place(top + left, dx: x0 + c * pitch + (pitch - card) / 2, dy: pool-y + r * pitch,
          line(start: (card * 0.15, card * 0.85), end: (card * 0.85, card * 0.15),
            stroke: (paint: luma(120), thickness: card * 0.06, cap: "round")))
      }
    }
  })
}
