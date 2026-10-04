// Gemeinsamer Stil und Zeichenhelfer für alle Rätselarten.
// Alles wird mit Formen gezeichnet (keine Emoji-/Symbolfonts nötig).

#let font-stack = ("Inter", "Helvetica Neue", "Arial", "DejaVu Sans")

#let ink = luma(25)
#let grid-line = luma(120)
#let paper = white

// Farben für Buchstaben/Gruppen (gut unterscheidbar, auch grau gedruckt lesbar)
#let palette = (
  rgb("#d62828"), rgb("#1d4ed8"), rgb("#e36414"), rgb("#1f2937"),
  rgb("#0b8a94"), rgb("#b5179e"), rgb("#2d6a4f"), rgb("#8a5a00"),
  rgb("#6d28d9"), rgb("#c2185b"), rgb("#00796b"), rgb("#5d4037"),
)
#let pal(i) = palette.at(calc.rem(i, palette.len()))
#let letter-color(l) = pal(l.to-unicode() - "A".to-unicode())

// Pastellfarben für Flächen (Queens-Regionen usw.)
#let pastels = (
  rgb("#ffd6d6"), rgb("#cfe3ff"), rgb("#ffe5bf"), rgb("#d7f5d0"),
  rgb("#ead7ff"), rgb("#fff3b0"), rgb("#c9f1f0"), rgb("#ffd1ec"),
  rgb("#e3e3e3"), rgb("#f2dcc6"),
)
#let pastel(i) = pastels.at(calc.rem(i, pastels.len()))

// ---------------------------------------------------------------- Formen
// Alle Formen: quadratische Box der Kantenlänge s, zentriert.

#let shape-box(s, body) = box(width: s, height: s, align(center + horizon, body))

#let sun(s, fill: rgb("#f4a300")) = box(width: s, height: s, {
  let c = s / 2
  for i in range(8) {
    let a = i * 45deg
    place(top + left, line(
      start: (c + calc.cos(a) * s * 0.30, c + calc.sin(a) * s * 0.30),
      end: (c + calc.cos(a) * s * 0.47, c + calc.sin(a) * s * 0.47),
      stroke: (paint: fill, thickness: s * 0.08, cap: "round")))
  }
  place(top + left, dx: s * 0.24, dy: s * 0.24, circle(radius: s * 0.26, fill: fill))
})

#let moon(s, fill: rgb("#3b4cca"), bg: white) = box(width: s, height: s, {
  place(top + left, dx: s * 0.1, dy: s * 0.1, circle(radius: s * 0.4, fill: fill))
  place(top + left, dx: s * 0.33, dy: s * 0.0, circle(radius: s * 0.36, fill: bg))
})

#let crown(s, fill: rgb("#e0a100"), stroke: luma(60)) = box(width: s, height: s, {
  let pts = (
    (0.12, 0.78), (0.12, 0.32), (0.32, 0.52), (0.5, 0.2),
    (0.68, 0.52), (0.88, 0.32), (0.88, 0.78),
  ).map(((x, y)) => (x * s, y * s))
  place(top + left, polygon(fill: fill, stroke: 0.6pt + stroke, ..pts))
  for (x, y) in ((0.12, 0.3), (0.5, 0.18), (0.88, 0.3)) {
    place(top + left, dx: x * s - s * 0.06, dy: y * s - s * 0.06, circle(radius: s * 0.06, fill: fill, stroke: 0.5pt + stroke))
  }
})

#let star-shape(s, fill: rgb("#f4a300"), stroke: none) = box(width: s, height: s, {
  let pts = range(10).map(i => {
    let r = if calc.rem(i, 2) == 0 { 0.48 } else { 0.2 }
    let a = -90deg + i * 36deg
    (s / 2 + calc.cos(a) * r * s, s * 0.53 + calc.sin(a) * r * s)
  })
  place(top + left, polygon(fill: fill, stroke: stroke, ..pts))
})

#let heart-shape(s, fill: rgb("#e63946")) = box(width: s, height: s, {
  place(top + left, curve(
    fill: fill,
    curve.move((0.5 * s, 0.88 * s)),
    curve.cubic((0.0 * s, 0.55 * s), (0.02 * s, 0.12 * s), (0.27 * s, 0.14 * s)),
    curve.cubic((0.4 * s, 0.15 * s), (0.5 * s, 0.3 * s), (0.5 * s, 0.32 * s)),
    curve.cubic((0.5 * s, 0.3 * s), (0.6 * s, 0.15 * s), (0.73 * s, 0.14 * s)),
    curve.cubic((0.98 * s, 0.12 * s), (1.0 * s, 0.55 * s), (0.5 * s, 0.88 * s)),
    curve.close(mode: "straight"),
  ))
})

// Symbole für Symbolgleichungen, über Namen ansprechbar
#let symbol(name, s) = {
  if name == "kreis" { shape-box(s, circle(radius: s * 0.4, fill: rgb("#e63946"))) }
  else if name == "dreieck" { box(width: s, height: s, place(top + left, polygon(fill: rgb("#2a9d8f"), (0.5 * s, 0.1 * s), (0.92 * s, 0.86 * s), (0.08 * s, 0.86 * s)))) }
  else if name == "quadrat" { shape-box(s, rect(width: s * 0.74, height: s * 0.74, fill: rgb("#457b9d"))) }
  else if name == "stern" { star-shape(s, fill: rgb("#f4a300")) }
  else if name == "herz" { heart-shape(s, fill: rgb("#d63384")) }
  else if name == "raute" { box(width: s, height: s, place(top + left, polygon(fill: rgb("#7b2cbf"), (0.5 * s, 0.06 * s), (0.92 * s, 0.5 * s), (0.5 * s, 0.94 * s), (0.08 * s, 0.5 * s)))) }
  else if name == "sonne" { sun(s) }
  else if name == "mond" { moon(s) }
  else if name == "krone" { crown(s) }
  else { shape-box(s, text(size: s * 0.6, name)) }
}

// Schwierigkeit als Sterne (für Kinder ohne Lesen): 1–3 gefüllte Sterne
#let difficulty(level, s: 11pt) = {
  let n = if level == "leicht" { 1 } else if level == "mittel" { 2 } else if level == "schwer" { 3 } else { 0 }
  if n > 0 {
    box(range(3).map(i => star-shape(s, fill: if i < n { rgb("#f4a300") } else { luma(215) })).join(h(1pt)))
  }
}

// ---------------------------------------------------------------- Raster
// Generisches Rechteckraster. cell(r, c, cs) liefert den Inhalt einer Zelle.
// fill(r, c) liefert eine Hintergrundfarbe oder none.
#let board-grid(rows, cols, width, cell: (r, c, cs) => none, fill: (r, c) => none,
                thin: 0.6pt + grid-line, thick: 1.8pt + ink, overlay: (cs) => none,
                underlay: (cs) => none) = {
  let cs = width / cols
  box(width: width, height: cs * rows, {
    for r in range(rows) {
      for c in range(cols) {
        let f = fill(r, c)
        if f != none {
          place(top + left, dx: c * cs, dy: r * cs, rect(width: cs, height: cs, fill: f, stroke: none))
        }
      }
    }
    underlay(cs)
    for i in range(1, rows) {
      place(top + left, line(start: (0pt, i * cs), end: (cols * cs, i * cs), stroke: thin))
    }
    for i in range(1, cols) {
      place(top + left, line(start: (i * cs, 0pt), end: (i * cs, rows * cs), stroke: thin))
    }
    overlay(cs)
    for r in range(rows) {
      for c in range(cols) {
        let x = cell(r, c, cs)
        if x != none {
          place(top + left, dx: c * cs, dy: r * cs, box(width: cs, height: cs, align(center + horizon, x)))
        }
      }
    }
    place(top + left, rect(width: cols * cs, height: rows * cs, stroke: thick))
  })
}

// Dicke Trennlinien zwischen Zellen verschiedener Regionen (Sudoku-Kästen, Käfige, Queens)
// regions: 2D-Array von Region-IDs
#let region-borders(regions, cs, stroke: 2pt + ink) = {
  let rows = regions.len()
  let cols = regions.at(0).len()
  for r in range(rows) {
    for c in range(cols) {
      if c + 1 < cols and regions.at(r).at(c) != regions.at(r).at(c + 1) {
        place(top + left, line(start: ((c + 1) * cs, r * cs), end: ((c + 1) * cs, (r + 1) * cs), stroke: stroke))
      }
      if r + 1 < rows and regions.at(r).at(c) != regions.at(r + 1).at(c) {
        place(top + left, line(start: (c * cs, (r + 1) * cs), end: ((c + 1) * cs, (r + 1) * cs), stroke: stroke))
      }
    }
  }
}

// Zahl in einer Zelle: vorgegeben (dunkel, fett) oder Lösung (blau, normal)
#let given-num(v, cs, scale: 0.55) = text(size: cs * scale, weight: "bold", fill: ink, str(v))
#let sol-num(v, cs, scale: 0.55) = text(size: cs * scale, weight: "medium", fill: rgb("#1d6fd8"), str(v))
#let sol-color = rgb("#1d6fd8")
