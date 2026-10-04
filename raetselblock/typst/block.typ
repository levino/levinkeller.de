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
    num-badge(ch, p.number), [], difficulty(p.level, s: 13pt))
  v(3mm)
  align(center, registry.at(ch.type).render(p, width: width, solution: false))
})

#let puzzle-pages(ch) = {
  let m = registry.at(ch.type)
  let L = m.layout
  let per = L.per-page
  let cols = if per <= 2 { 1 } else { 2 }
  let rows = calc.ceil(per / cols)
  for chunk in ch.puzzles.chunks(per) {
    pagebreak(weak: true)
    block(height: 100%, width: 100%,
      grid(columns: (1fr,) * cols, rows: (1fr,) * rows, align: center + horizon,
        ..chunk.map(p => puzzle-block(ch, p, L.width))))
  }
}

#let opener(ch) = {
  let m = registry.at(ch.type)
  let col = ccolor(ch)
  pagebreak(weak: true)
  current.update(none)
  block(width: 100%, fill: col, radius: 8pt, inset: (x: 16pt, y: 14pt), {
    grid(columns: (auto, 1fr), align: horizon, column-gutter: 14pt,
      box(fill: white, radius: 50%, width: 46pt, height: 46pt,
        align(center + horizon, text(26pt, weight: "black", fill: col, str(ch.index)))),
      text(30pt, weight: "black", fill: white, m.title))
  })
  v(6mm)
  block(width: 100%, fill: luma(246), radius: 6pt, inset: 12pt, {
    text(9pt, weight: "bold", fill: luma(110), upper[Zum Vorlesen])
    v(1mm)
    m.rules
    if "tip" in dictionary(m) {
      v(1mm)
      text(10pt, fill: luma(80))[*Tipp:* #m.tip]
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
#pagebreak()
#current.update(none)
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
