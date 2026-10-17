// Druckvorlage für die Kochrezepte. Die Daten kommen als JSON über
// `sys.inputs.data` (siehe src/recipes/pdf.ts), das Raster der Tabelle ist
// schon fertig berechnet (src/recipes/layout.ts) – hier wird nur gezeichnet.
//
// Schrift: Libertinus Serif ist im Typst-Compiler eingebaut, das PDF sieht
// deshalb auf jedem Rechner (und im Docker-Build ohne Systemschriften) gleich aus.

#let data = json(bytes(sys.inputs.data))

#let accent = rgb("#3f8f3f")
#let paper = rgb("#fdfde6")

#set document(title: data.title, author: "Levin Keller")
#set text(font: "Libertinus Serif", lang: "de", size: 10.5pt)
#set par(justify: false)

#let recipe-table(recipe) = {
  let grid = recipe.grid
  let prep = recipe.prep.map(text => table.cell(
    colspan: grid.columns,
    align: center,
    text,
  ))
  let cells = grid.cells.map(cell => table.cell(
    x: cell.col,
    y: cell.row + recipe.prep.len(),
    rowspan: cell.rowSpan,
    colspan: cell.colSpan,
    align: if cell.kind == "ingredient" { left + horizon } else { center + horizon },
    cell.text,
  ))
  // Lange Rezepte etwas kleiner setzen, damit sie auf eine Seite passen
  let dense = grid.rows + recipe.prep.len() > 15
  set text(size: if dense { 8.5pt } else { 10pt })
  table(
    // Zutatenspalte breiter, die Schritte teilen sich den Rest
    columns: (2.2fr,) + (1fr,) * (grid.columns - 1),
    stroke: 0.6pt + accent,
    inset: (x: 4pt, y: if dense { 3pt } else { 5pt }),
    fill: paper,
    ..prep,
    ..cells,
  )
}

#let recipe-page(recipe) = page(
  paper: "a4",
  // Viele Arbeitsschritte nebeneinander passen nur quer aufs Blatt
  flipped: recipe.grid.columns > 6,
  margin: 1.4cm,
  footer: context align(center, text(size: 8pt, fill: luma(120))[
    levinkeller.de/de/docs/kochrezepte/#recipe.id
  ]),
)[
  #text(size: 17pt, weight: "bold", recipe.title)
  #if recipe.at("servings", default: none) != none [
    #h(0.4em) #text(size: 12pt)[(#recipe.servings)]
  ]
  #if recipe.at("time", default: none) != none [
    #h(0.4em) #text(size: 12pt, fill: luma(90))[· #recipe.time]
  ]
  #if recipe.at("description", default: none) != none [
    #v(-0.3em)
    #text(fill: luma(70), style: "italic", recipe.description)
  ]
  #v(0.4em)
  #recipe-table(recipe)
  #if recipe.tips.len() > 0 [
    #v(0.6em)
    *Tipps*
    #list(..recipe.tips)
  ]
  #if recipe.at("source", default: none) != none [
    #v(0.4em)
    #text(size: 9pt, fill: luma(90))[Quelle: #recipe.source.text]
  ]
]

#for recipe in data.recipes {
  recipe-page(recipe)
}
