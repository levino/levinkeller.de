// Rätselblock – Hauptdokument. Daten: data/block.json (aus build.py)
#import "style.typ": *
#import sys.inputs.at("registry", default: "registry.typ"): registry

#let data = json(sys.inputs.at("data", default: "/data/block.json"))
#let chapters = data.chapters

#let chapter-colors = (
  rgb("#e36414"), rgb("#1d4ed8"), rgb("#2d6a4f"), rgb("#b5179e"), rgb("#d62828"),
  rgb("#0b8a94"), rgb("#6d28d9"), rgb("#c77d00"), rgb("#1f2937"), rgb("#c2185b"),
  rgb("#00796b"), rgb("#5d4037"), rgb("#3a5a40"), rgb("#9d0208"),
)
#let ccolor(ch) = chapter-colors.at(calc.rem(ch.index - 1, chapter-colors.len()))

#let current = state("chapter", none)

#set page(paper: "a4", margin: (x: 16mm, top: 20mm, bottom: 16mm),
  header: context {
    let ch = current.get()
    if ch != none {
      let col = ccolor(ch)
      grid(columns: (auto, 1fr), align: horizon, column-gutter: 6pt,
        box(fill: col, radius: 50%, width: 18pt, height: 18pt,
          align(center + horizon, text(10pt, weight: "bold", fill: white, str(ch.index)))),
        text(10pt, weight: "bold", fill: col, registry.at(ch.type).title),
      )
    }
  },
  footer: context align(center, text(9pt, fill: luma(130), counter(page).display())),
)
#set text(font: font-stack, lang: "de", size: 11pt)
#set par(justify: false)

// ---------------------------------------------------------------- Bausteine
#let num-badge(ch, n, size: 22pt) = box(
  fill: ccolor(ch), radius: 50%, width: size, height: size,
  align(center + horizon, text(size * 0.48, weight: "bold", fill: white, str(n))))

#let puzzle-block(ch, p, width) = block(breakable: false, width: width, {
  grid(columns: (auto, 1fr, auto), align: horizon, column-gutter: 6pt,
    num-badge(ch, p.number, size: 18pt), [], difficulty(p.level, s: 11pt))
  v(2mm)
  align(center, registry.at(ch.type).render(p, width: width, solution: false))
})

// Wie viele Rätsel schon auf der Erklärseite stehen (eine Reihe, wenn mehrere pro Seite passen)
#let opener-take(m) = if m.layout.per-page >= 4 { 2 } else { 0 }

#let puzzle-pages(ch) = {
  let m = registry.at(ch.type)
  let L = m.layout
  let per = L.per-page
  let cols = if per <= 2 { 1 } else { 2 }
  let rows = calc.ceil(per / cols)
  for chunk in ch.puzzles.slice(calc.min(opener-take(m), ch.puzzles.len())).chunks(per) {
    pagebreak(weak: true)
    block(height: 100%, width: 100%,
      grid(columns: (1fr,) * cols, rows: (1fr,) * rows, align: center + horizon,
        ..chunk.map(p => puzzle-block(ch, p, L.width))))
  }
}

#let opener(ch) = {
  let m = registry.at(ch.type)
  let col = ccolor(ch)
  current.update(none)
  pagebreak(weak: true)
  block(width: 100%, fill: col, radius: 6pt, inset: (x: 12pt, y: 9pt), {
    grid(columns: (auto, 1fr), align: horizon, column-gutter: 10pt,
      box(fill: white, radius: 50%, width: 32pt, height: 32pt,
        align(center + horizon, text(18pt, weight: "black", fill: col, str(ch.index)))),
      text(22pt, weight: "black", fill: white, m.title))
  })
  v(3mm)
  block(width: 100%, fill: luma(246), radius: 6pt, inset: 10pt, {
    set text(10pt)
    text(8pt, weight: "bold", fill: luma(110), upper[Zum Vorlesen])
    v(0.5mm)
    m.rules
    if "tip" in dictionary(m) {
      v(0.5mm)
      text(9pt, fill: luma(80))[*Tipp:* #m.tip]
    }
  })
  v(1fr)
  let w = m.layout.example-width
  align(center, grid(columns: (auto, auto, auto), align: horizon, column-gutter: 8mm,
    block(breakable: false, { align(center, text(10pt, weight: "bold", fill: luma(110), upper[Beispiel])); v(2mm); m.render(ch.example, width: w, solution: false) }),
    text(28pt, fill: col, sym.arrow.r),
    block(breakable: false, { align(center, text(10pt, weight: "bold", fill: col, upper[Lösung])); v(2mm); m.render(ch.example, width: w, solution: true) }),
  ))
  v(1fr)
  let take = calc.min(opener-take(m), ch.puzzles.len())
  if take > 0 {
    line(length: 100%, stroke: (paint: luma(200), dash: "dashed"))
    v(1fr)
    grid(columns: (1fr, 1fr), align: center + horizon,
      ..ch.puzzles.slice(0, take).map(p => puzzle-block(ch, p, m.layout.width)))
    v(1fr)
  }
  current.update(ch)
}

// ---------------------------------------------------------------- Titelseite
#page(header: none, {
  v(1fr)
  align(center, {
    text(52pt, weight: "black", fill: rgb("#e36414"))[RÄTSEL]
    linebreak()
    text(52pt, weight: "black", fill: rgb("#1d4ed8"))[BLOCK]
    v(10mm)
    box(crown(46pt)) + h(8pt) + box(sun(46pt)) + h(8pt) + box(moon(46pt)) + h(8pt) + box(star-shape(46pt)) + h(8pt) + box(heart-shape(46pt))
    v(14mm)
    text(14pt, fill: luma(90))[#chapters.map(c => c.puzzles.len()).sum() Rätsel · #chapters.len() Rätselarten · mit Lösungen]
  })
  v(1fr)
  align(center, box(width: 120mm, {
    text(12pt, fill: luma(100))[Dieser Block gehört:]
    v(12mm)
    line(length: 100%, stroke: 1pt + luma(150))
  }))
  v(2fr)
})

// ---------------------------------------------------------------- Geschafft-Seite
#page(header: none, {
  text(26pt, weight: "black")[Geschafft!]
  h(6pt)
  box(star-shape(24pt))
  v(2mm)
  text(10pt, fill: luma(90))[Male für jedes gelöste Rätsel den Kreis aus. Die Zahl im großen Kreis ist das Kapitel.]
  v(5mm)
  for ch in chapters {
    let m = registry.at(ch.type)
    block(breakable: false, below: 4.2mm, grid(columns: (28pt, 1fr), align: horizon, column-gutter: 8pt,
      num-badge(ch, ch.index, size: 24pt),
      {
        text(9pt, fill: luma(100), m.title)
        linebreak()
        ch.puzzles.map(p => box(width: 17pt, height: 17pt, stroke: 1.2pt + ccolor(ch), radius: 50%,
          align(center + horizon, text(8pt, fill: ccolor(ch), str(p.number))))).join(h(3pt))
      }))
  }
})

// ---------------------------------------------------------------- Kapitel
#for ch in chapters {
  opener(ch)
  puzzle-pages(ch)
}

// ---------------------------------------------------------------- Lösungen
#current.update(none)
#pagebreak()
#text(26pt, weight: "black")[Lösungen]
#v(4mm)
#for ch in chapters {
  let m = registry.at(ch.type)
  let sw = m.layout.solution-width
  let cols = calc.max(1, calc.floor(178mm / (sw + 8mm)))
  block(breakable: false, sticky: true, below: 3mm, grid(columns: (auto, 1fr), align: horizon, column-gutter: 6pt,
    num-badge(ch, ch.index, size: 18pt), text(13pt, weight: "bold", fill: ccolor(ch), m.title)))
  grid(columns: (1fr,) * cols, column-gutter: 4mm, row-gutter: 5mm, align: left,
    ..ch.puzzles.map(p => block(breakable: false, {
      text(9pt, weight: "bold", fill: ccolor(ch))[#ch.index.#p.number]
      v(1mm)
      m.render(p, width: sw, solution: true)
    })))
  v(6mm)
}
