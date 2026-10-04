#import "../style.typ": *

#let title = "Bilderrätsel"
#let rules = [
  Die Zahlen sagen dir, wie viele Kästchen in einer Reihe *nebeneinander* schwarz angemalt
  werden – links für jede Zeile, oben für jede Spalte, immer in der richtigen Reihenfolge.
  Zwischen zwei schwarzen Stücken bleibt mindestens ein Kästchen weiß. Eine 0 heißt: alles weiß.
  Wenn alles stimmt, siehst du ein Bild!
]
#let tip = [Mit großen Zahlen anfangen: Eine 8 in einer Zeile mit 10 Kästchen macht die mittleren
  6 Kästchen sicher schwarz. Sichere weiße Kästchen mit einem kleinen Punkt markieren.]
#let layout = (per-page: 2, width: 118mm, example-width: 52mm, solution-width: 36mm)

#let render(p, width: 172mm, solution: false) = {
  let d = p.data
  let W = d.w
  let H = d.h
  let show-clues = not solution or p.at("level", default: "") == "beispiel"
  let kr = calc.max(1, ..d.rows.map(r => r.len()))
  let kc = calc.max(1, ..d.cols.map(c => c.len()))
  let fr = 0.78   // Breite eines Zeilen-Hinweisfeldes in Zellbreiten
  let fc = 0.72   // Höhe eines Spalten-Hinweisfeldes in Zellbreiten
  let cs = if show-clues { width / (W + kr * fr) } else { width / W }
  let ox = if show-clues { kr * fr * cs } else { 0pt }
  let oy = if show-clues { kc * fc * cs } else { 0pt }
  let fsize = cs * 0.5
  let clue-bg = luma(232)
  let thin = calc.max(0.3pt, cs * 0.035) + grid-line
  let thick = calc.max(0.8pt, cs * 0.11) + ink
  box(width: width, height: oy + H * cs, {
    if show-clues {
      // Hintergrund der Hinweisbereiche
      place(top + left, dx: 0pt, dy: oy, rect(width: ox, height: H * cs, fill: clue-bg, stroke: none))
      place(top + left, dx: ox, dy: 0pt, rect(width: W * cs, height: oy, fill: clue-bg, stroke: none))
      // Trennlinien im Hinweisbereich (weiß, alle 5 etwas kräftiger)
      for r in range(1, H) {
        let t = if calc.rem(r, 5) == 0 { cs * 0.08 } else { cs * 0.035 }
        place(top + left, line(start: (0pt, oy + r * cs), end: (ox, oy + r * cs), stroke: t + white))
      }
      for c in range(1, W) {
        let t = if calc.rem(c, 5) == 0 { cs * 0.08 } else { cs * 0.035 }
        place(top + left, line(start: (ox + c * cs, 0pt), end: (ox + c * cs, oy), stroke: t + white))
      }
      // Zeilen-Hinweise (rechtsbündig nebeneinander)
      for (r, cl) in d.rows.enumerate() {
        let nums = if cl.len() == 0 { (0,) } else { cl }
        let n = nums.len()
        for (i, v) in nums.enumerate() {
          let x = ox - (n - i) * fr * cs
          place(top + left, dx: x, dy: oy + r * cs, box(width: fr * cs, height: cs,
            align(center + horizon, text(size: fsize, weight: "bold", fill: ink, str(v)))))
        }
      }
      // Spalten-Hinweise (unten bündig untereinander)
      for (c, cl) in d.cols.enumerate() {
        let nums = if cl.len() == 0 { (0,) } else { cl }
        let n = nums.len()
        for (i, v) in nums.enumerate() {
          let y = oy - (n - i) * fc * cs
          place(top + left, dx: ox + c * cs, dy: y, box(width: cs, height: fc * cs,
            align(center + horizon, text(size: fsize, weight: "bold", fill: ink, str(v)))))
        }
      }
    }
    // Raster
    for r in range(1, H) {
      if calc.rem(r, 5) != 0 {
        place(top + left, line(start: (ox, oy + r * cs), end: (ox + W * cs, oy + r * cs), stroke: thin))
      }
    }
    for c in range(1, W) {
      if calc.rem(c, 5) != 0 {
        place(top + left, line(start: (ox + c * cs, oy), end: (ox + c * cs, oy + H * cs), stroke: thin))
      }
    }
    let mid = calc.max(0.6pt, cs * 0.07) + ink
    for r in range(5, H, step: 5) {
      place(top + left, line(start: (ox, oy + r * cs), end: (ox + W * cs, oy + r * cs), stroke: mid))
    }
    for c in range(5, W, step: 5) {
      place(top + left, line(start: (ox + c * cs, oy), end: (ox + c * cs, oy + H * cs), stroke: mid))
    }
    // Lösung: gefüllte Felder
    if solution {
      for (r, row) in p.solution.grid.enumerate() {
        for (c, ch) in row.clusters().enumerate() {
          if ch == "#" {
            place(top + left, dx: ox + c * cs, dy: oy + r * cs,
              rect(width: cs + 0.2pt, height: cs + 0.2pt, fill: ink, stroke: none))
          }
        }
      }
    }
    place(top + left, dx: ox, dy: oy, rect(width: W * cs, height: H * cs, stroke: thick))
  })
}
