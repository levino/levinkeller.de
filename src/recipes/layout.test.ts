import { describe, expect, it } from 'vitest'
import { layoutRecipe, type RecipeNode } from './layout'

// Das Bananenbrot aus dem Original von Cooking for Engineers
const bananaBread: RecipeNode = {
  action: ['fold', 'bake', 'cool in pan', 'cool on wire rack'],
  with: [
    {
      action: 'mash until smooth',
      with: [
        { ingredient: 'bananas', action: 'mash' },
        { ingredient: 'butter', action: 'melt' },
        'vanilla',
        { ingredient: 'eggs', action: 'lightly beat' },
      ],
    },
    { action: 'whisk', with: ['flour', 'sugar', 'soda', 'powder', 'salt'] },
    'walnuts',
  ],
}

const at = (row: number, col: number) =>
  layoutRecipe(bananaBread).cells.find(
    (cell) => cell.row === row && cell.col === col
  )

describe('layoutRecipe', () => {
  it('ordnet Zutaten zeilenweise und Schritte spaltenweise an', () => {
    const grid = layoutRecipe(bananaBread)
    expect(grid.rows).toBe(10)
    expect(grid.columns).toBe(7)
    expect(at(0, 0)).toMatchObject({ kind: 'ingredient', text: 'bananas' })
    expect(at(0, 1)).toMatchObject({ text: 'mash', rowSpan: 1 })
    expect(at(0, 2)).toMatchObject({ text: 'mash until smooth', rowSpan: 4 })
    expect(at(4, 1)).toMatchObject({ text: 'whisk', rowSpan: 5 })
    expect(at(0, 3)).toMatchObject({ text: 'fold', rowSpan: 10 })
    expect(at(0, 6)).toMatchObject({ text: 'cool on wire rack' })
  })

  it('füllt Lücken mit leeren Zellen', () => {
    expect(at(2, 1)).toMatchObject({ kind: 'empty', colSpan: 1 })
    expect(at(4, 2)).toMatchObject({ kind: 'empty', rowSpan: 5, colSpan: 1 })
    expect(at(9, 1)).toMatchObject({ kind: 'empty', rowSpan: 1, colSpan: 2 })
  })

  it('belegt jede Rasterzelle genau einmal', () => {
    const grid = layoutRecipe(bananaBread)
    const covered = grid.cells.flatMap((cell) =>
      Array.from({ length: cell.rowSpan * cell.colSpan }, (_, i) => [
        cell.row + Math.floor(i / cell.colSpan),
        cell.col + (i % cell.colSpan),
      ])
    )
    expect(covered).toHaveLength(grid.rows * grid.columns)
    expect(new Set(covered.map(String)).size).toBe(grid.rows * grid.columns)
  })
})
