#import "../style.typ": *

#let title = "Kreuzrechnen"
#let rules = [
  Schreibe die Zahlen von 1 bis 9 in die leeren Kästchen – jede Zahl genau einmal.
  Jede Reihe von links nach rechts und jede Spalte von oben nach unten muss das Ergebnis
  ergeben. Rechne immer der Reihe nach, Schritt für Schritt (nicht Punkt vor Strich).
]
#let tip = [Beginne bei Reihen mit nur einem leeren Kästchen oder mit Mal und Geteilt – dort
  passen oft nur wenige Zahlen. Streiche oben am Rand die Zahlen weg, die schon benutzt sind.]
#let layout = (per-page: 2, width: 100mm, example-width: 64mm, solution-width: 50mm)

#let op-sym(o) = if o == "+" { "+" } else if o == "-" { "−" } else if o == "*" { "×" } else { "÷" }

// Maße in Einheiten der Zellgröße cs
#let k-op = 0.62   // Platz für Rechenzeichen
#let k-eq = 0.62   // Platz für Gleichheitszeichen
#let k-res = 1.3   // Ergebnisfeld

#let render(p, width: 100mm, solution: false) = {
  let d = p.data
  let units = 3 + 2 * k-op + k-eq + k-res
  let cs = width / units
  let pos(i) = i * (1 + k-op) * cs                 // linke/obere Kante von Zelle i
  let eq-start = pos(2) + cs                       // Beginn des =-Bereichs
  let res-start = eq-start + k-eq * cs             // Beginn des Ergebnisfelds
  let total = res-start + k-res * cs
  let lw = calc.max(0.6pt, cs * 0.045)
  let op-size = cs * 0.5
  let num-size = cs * 0.56

  let eq-mark(vertical) = {
    // zwei kurze Striche, waagerecht (=) oder senkrecht (‖)
    let len = cs * 0.34
    let gap = cs * 0.13
    let th = calc.max(0.8pt, cs * 0.055)
    let st = (paint: ink, thickness: th, cap: "round")
    box(width: len, height: len, {
      if vertical {
        for x in (len / 2 - gap / 2, len / 2 + gap / 2) {
          place(top + left, line(start: (x, 0pt), end: (x, len), stroke: st))
        }
      } else {
        for y in (len / 2 - gap / 2, len / 2 + gap / 2) {
          place(top + left, line(start: (0pt, y), end: (len, y), stroke: st))
        }
      }
    })
  }

  let res-box(v, w, h) = box(width: w, height: h, fill: luma(232), radius: cs * 0.14,
    stroke: lw + luma(150),
    align(center + horizon, text(size: num-size * (if v >= 100 { 0.82 } else { 1 }), weight: "bold", fill: ink, str(v))))

  box(width: total, height: total, {
    // Zahlenfelder
    for r in range(3) {
      for c in range(3) {
        let g = d.grid.at(r).at(c)
        let body = if g != 0 {
          text(size: num-size, weight: "bold", fill: ink, str(g))
        } else if solution {
          text(size: num-size, weight: "medium", fill: sol-color, str(p.solution.grid.at(r).at(c)))
        } else { none }
        place(top + left, dx: pos(c), dy: pos(r),
          rect(width: cs, height: cs, radius: cs * 0.08,
            fill: if g != 0 { luma(242) } else { white },
            stroke: (lw * 1.6) + ink,
            align(center + horizon, body)))
      }
    }
    // waagerechte Rechenzeichen
    for r in range(3) {
      for i in range(2) {
        place(top + left, dx: pos(i) + cs, dy: pos(r),
          box(width: k-op * cs, height: cs,
            align(center + horizon, text(size: op-size, weight: "bold", fill: ink, op-sym(d.hops.at(r).at(i))))))
      }
      place(top + left, dx: eq-start, dy: pos(r),
        box(width: k-eq * cs, height: cs, align(center + horizon, eq-mark(false))))
      place(top + left, dx: res-start, dy: pos(r) + cs * 0.1,
        res-box(d.rows.at(r), k-res * cs, cs * 0.8))
    }
    // senkrechte Rechenzeichen
    for c in range(3) {
      for i in range(2) {
        place(top + left, dx: pos(c), dy: pos(i) + cs,
          box(width: cs, height: k-op * cs,
            align(center + horizon, text(size: op-size, weight: "bold", fill: ink, op-sym(d.vops.at(c).at(i))))))
      }
      place(top + left, dx: pos(c), dy: eq-start,
        box(width: cs, height: k-eq * cs, align(center + horizon, eq-mark(true))))
      place(top + left, dx: pos(c) + cs * 0.05, dy: res-start,
        res-box(d.cols.at(c), cs * 0.9, k-res * cs * 0.75))
    }
  })
}
