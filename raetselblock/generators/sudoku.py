"""Sudoku (4×4, 6×6, 9×9) – logisch ohne Raten lösbar, Stufe über benötigte Techniken."""
from .latin_core import LogicSolver, count_solutions_sat, random_latin

# level: (n, (Kastenhöhe, Kastenbreite), erlaubte Techniken, Pflicht-Technik, min. Vorgaben)
LEVELS = {
    "beispiel": (4, (2, 2), ("single",), None, 8),
    "leicht": (6, (2, 3), ("single",), None, 17),
    "mittel": (6, (2, 3), ("single", "hidden"), "hidden", 12),
    "schwer": (9, (3, 3), ("single", "hidden", "pairs", "pointing"), "hidden", 27),
}


def _solve(n, box, grid, techniques):
    givens = {r * n + c: v for r in range(n) for c in range(n) if (v := grid[r][c])}
    ok, _, stats = LogicSolver(n, box, givens).solve(techniques)
    return ok, stats


def _make(n, box, techniques, required, min_givens, rng):
    sol = random_latin(n, rng, box)
    grid = [row[:] for row in sol]
    cells = [(r, c) for r in range(n) for c in range(n)]
    rng.shuffle(cells)
    count = n * n
    for r, c in cells:
        if count <= min_givens:
            break
        v = grid[r][c]
        grid[r][c] = 0
        if _solve(n, box, grid, techniques)[0]:
            count -= 1
        else:
            grid[r][c] = v
    if required:
        # Pflicht-Technik muss wirklich gebraucht werden (nur mit den einfacheren geht es nicht)
        easier = techniques[:techniques.index(required)]
        if _solve(n, box, grid, easier)[0]:
            return None
    return grid, sol


def generate(level, rng):
    n, box, techniques, required, min_givens = LEVELS[level]
    while True:
        res = _make(n, box, techniques, required, min_givens, rng)
        if not res:
            continue
        grid, sol = res
        if level == "schwer":
            # Hidden Singles mehrfach nötig
            ok, stats = _solve(n, box, grid, techniques)
            if stats["hidden"] < 6:
                continue
        data = {"size": n, "box": list(box), "givens": grid}
        assert count_solutions(data) == 1
        return {"data": data, "solution": {"grid": sol}}


def count_solutions(data, limit=2):
    n = data["size"]
    givens = {(r, c): v for r in range(n) for c in range(n) if (v := data["givens"][r][c])}
    return count_solutions_sat(n, tuple(data["box"]), givens, limit=limit)
