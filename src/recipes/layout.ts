/**
 * Rezepte im Tabellenformat von „Cooking for Engineers“: links stehen die
 * Zutaten untereinander, rechts davon die Arbeitsschritte. Ein Schritt
 * überspannt genau die Zeilen der Zutaten (oder Zwischenergebnisse), die er
 * zusammenführt. Von links nach rechts gelesen ergibt sich der Ablauf.
 *
 * Ein Rezept wird als Baum beschrieben: Blätter sind Zutaten, innere Knoten
 * Arbeitsschritte. Dieses Modul rechnet den Baum in ein Raster aus Zellen mit
 * Zeilen-/Spaltenspannen um. Webseite (HTML-Tabelle) und PDF (Typst) zeichnen
 * beide genau dieses Raster.
 */

/** Ein Arbeitsschritt oder mehrere, die nacheinander folgen. */
export type Action = string | string[]

/** Zutat ohne eigenen Arbeitsschritt, z. B. „2 Eier“. */
export type PlainIngredient = string

/** Zutat, die vorbereitet wird, bevor sie mit anderem zusammenkommt. */
export interface PreparedIngredient {
  ingredient: string
  action?: Action
}

/** Arbeitsschritt, der mehrere Zutaten oder Zwischenergebnisse verbindet. */
export interface Step {
  action: Action
  with: RecipeNode[]
}

export type RecipeNode = PlainIngredient | PreparedIngredient | Step

export type CellKind = 'ingredient' | 'action' | 'empty'

export interface Cell {
  kind: CellKind
  text: string
  /** 0-basiert, Zeile 0 ist die erste Zutat */
  row: number
  /** 0-basiert, Spalte 0 sind die Zutaten */
  col: number
  rowSpan: number
  colSpan: number
}

export interface Grid {
  rows: number
  columns: number
  cells: Cell[]
}

const toActions = (action: Action | undefined): string[] =>
  action === undefined ? [] : typeof action === 'string' ? [action] : action

const isStep = (node: RecipeNode): node is Step =>
  typeof node === 'object' && 'with' in node

interface Laid {
  cells: Cell[]
  rows: number
  /** Spalte, in der der letzte Schritt dieses Teilbaums steht */
  lastCol: number
}

const actionCells = (
  actions: string[],
  row: number,
  firstCol: number,
  rowSpan: number
): Cell[] =>
  actions.map((text, index) => ({
    kind: 'action',
    text,
    row,
    col: firstCol + index,
    rowSpan,
    colSpan: 1,
  }))

/**
 * Jeder Schritt steht so weit links wie möglich: direkt rechts neben dem
 * spätesten Schritt seiner Eingänge. Eingänge, die früher fertig sind, werden
 * mit einer leeren Zelle bis dorthin aufgefüllt.
 */
const layNode = (node: RecipeNode, row: number): Laid => {
  if (!isStep(node)) {
    const { ingredient, action } =
      typeof node === 'string' ? { ingredient: node, action: undefined } : node
    const actions = toActions(action)
    return {
      cells: [
        {
          kind: 'ingredient',
          text: ingredient,
          row,
          col: 0,
          rowSpan: 1,
          colSpan: 1,
        },
        ...actionCells(actions, row, 1, 1),
      ],
      rows: 1,
      lastCol: actions.length,
    }
  }

  const children = node.with.reduce<{
    laid: (Laid & { row: number })[]
    next: number
  }>(
    ({ laid, next }, child) => {
      const result = layNode(child, next)
      return {
        laid: [...laid, { ...result, row: next }],
        next: next + result.rows,
      }
    },
    { laid: [], next: row }
  ).laid
  const rows = children.reduce((sum, child) => sum + child.rows, 0)
  const firstCol = Math.max(...children.map((child) => child.lastCol)) + 1
  const fillers: Cell[] = children
    .filter((child) => child.lastCol < firstCol - 1)
    .map((child) => ({
      kind: 'empty',
      text: '',
      row: child.row,
      col: child.lastCol + 1,
      rowSpan: child.rows,
      colSpan: firstCol - 1 - child.lastCol,
    }))
  const actions = toActions(node.action)
  return {
    cells: [
      ...children.flatMap((child) => child.cells),
      ...fillers,
      ...actionCells(actions, row, firstCol, rows),
    ],
    rows,
    lastCol: firstCol + actions.length - 1,
  }
}

export const layoutRecipe = (process: RecipeNode): Grid => {
  const { cells, rows, lastCol } = layNode(process, 0)
  return {
    rows,
    columns: lastCol + 1,
    cells: [...cells].sort((a, b) => a.row - b.row || a.col - b.col),
  }
}
