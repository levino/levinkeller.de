"""Rechenkäfige (Prinzip KenKen): lateinisches Quadrat + Käfige mit Zielzahl und Rechenzeichen.

Stufen:
  beispiel 3×3, nur +, logisch mit Singles/Käfig-Kombinationen
  leicht   4×4, + und −, ohne Hidden Singles lösbar
  mittel   5×5, + − × ÷, Hidden Singles erlaubt
  schwer   6×6, + − × ÷, höchstens ein Ein-Zellen-Käfig, braucht mehrere Hidden Singles
           oder fortgeschrittene Schritte (Paare, Käfig-Zeilen-Logik)
"""
from .latin_core import (ADD, DIV, GIVEN, MUL, SUB, LogicSolver, count_solutions_sat,
                         random_latin)

LEVELS = {
    # n, Rechenarten, max Käfiggröße, Gewichte für Käfiggrößen (1, 2, 3, 4), max Ein-Zellen-Käfige,
    # erlaubte Techniken
    "beispiel": dict(n=3, ops=(ADD,), maxsize=3, weights=(1, 6, 3, 0), singles=(1, 2),
                     tech=("single", "cage")),
    "leicht": dict(n=4, ops=(ADD, SUB), maxsize=3, weights=(1, 7, 3, 0), singles=(1, 2),
                   tech=("single", "cage")),
    "mittel": dict(n=5, ops=(ADD, SUB, MUL, DIV), maxsize=3, weights=(1, 6, 4, 0), singles=(1, 2),
                   tech=("single", "cage", "hidden")),
    "schwer": dict(n=6, ops=(ADD, SUB, MUL, DIV), maxsize=4, weights=(0, 5, 5, 2), singles=(0, 1),
                   tech=("single", "cage", "hidden", "pairs", "cageline")),
}

MAX_PRODUCT = 120   # Ergebnisse bleiben im Bereich, den sie rechnen kann
NB = ((0, 1), (1, 0), (0, -1), (-1, 0))


def _partition(n, cfg, rng):
    """Zufällige Zerlegung des Gitters in zusammenhängende Käfige."""
    owner = [[-1] * n for _ in range(n)]
    cages = []
    sizes, weights = (1, 2, 3, 4)[:cfg["maxsize"]], cfg["weights"][:cfg["maxsize"]]
    cells = [(r, c) for r in range(n) for c in range(n)]
    rng.shuffle(cells)
    # Zellen mit wenigen freien Nachbarn zuerst, damit wenig Einzelzellen übrig bleiben
    while True:
        free = [(r, c) for r, c in cells if owner[r][c] < 0]
        if not free:
            break

        def nfree(rc):
            return sum(0 <= rc[0] + dr < n and 0 <= rc[1] + dc < n and owner[rc[0] + dr][rc[1] + dc] < 0
                       for dr, dc in NB)
        start = min(free, key=nfree)
        target = rng.choices(sizes, weights)[0]
        cage = [start]
        owner[start[0]][start[1]] = len(cages)
        while len(cage) < target:
            opts = [(r + dr, c + dc) for r, c in cage for dr, dc in NB
                    if 0 <= r + dr < n and 0 <= c + dc < n and owner[r + dr][c + dc] < 0]
            if not opts:
                break
            r, c = rng.choice(opts)
            owner[r][c] = len(cages)
            cage.append((r, c))
        cages.append(sorted(cage))
    return cages


def _assign(cells, sol, cfg, rng):
    vals = [sol[r][c] for r, c in cells]
    ops = cfg["ops"]
    if len(cells) == 1:
        return GIVEN, vals[0]
    choices = []
    if len(cells) == 2:
        a, b = max(vals), min(vals)
        if DIV in ops and a % b == 0 and a != b:
            choices += [(DIV, a // b)] * 3
        if SUB in ops:
            choices += [(SUB, a - b)] * 2
        if MUL in ops and a * b <= MAX_PRODUCT:
            choices += [(MUL, a * b)] * 1
        choices += [(ADD, a + b)] * (2 if len(ops) <= 2 else 1)
    else:
        p = 1
        for v in vals:
            p *= v
        if MUL in ops and p <= MAX_PRODUCT:
            choices += [(MUL, p)] * 2
        choices += [(ADD, sum(vals))] * 2
    return rng.choice(choices)


def _attempt(level, rng):
    cfg = LEVELS[level]
    n = cfg["n"]
    sol = random_latin(n, rng)
    cells_list = _partition(n, cfg, rng)
    ns = sum(len(c) == 1 for c in cells_list)
    if not cfg["singles"][0] <= ns <= cfg["singles"][1]:
        return None
    cages = []
    for cells in cells_list:
        op, t = _assign(cells, sol, cfg, rng)
        cages.append((cells, op, t))
    used = {op for _, op, _ in cages if op != GIVEN}
    if level in ("mittel", "schwer") and len(used) < 4:
        return None
    if level == "leicht" and len(used) < 2:
        return None
    ok, grid, stats = LogicSolver(n, cages=cages).solve(cfg["tech"])
    if not ok:
        return None
    if level == "mittel" and stats["hidden"] < 1:
        return None
    if level == "schwer":
        hard = stats["pairs"] + stats["cageline"]
        if not (hard >= 1 or stats["hidden"] >= 4):
            return None
        # nur mit Grundtechniken darf es nicht gehen
        if LogicSolver(n, cages=cages).solve(("single", "cage"))[0]:
            return None
    if level == "leicht" and stats["cage"] < 3:
        return None
    return sol, cages


def generate(level, rng):
    while True:
        res = _attempt(level, rng)
        if res:
            sol, cages = res
            data = {"size": LEVELS[level]["n"],
                    "cages": [{"cells": [list(c) for c in cells], "op": op, "target": t}
                              for cells, op, t in cages]}
            assert count_solutions(data) == 1
            return {"data": data, "solution": {"grid": sol}}


def count_solutions(data, limit=2):
    cages = [([tuple(c) for c in k["cells"]], k["op"], k["target"]) for k in data["cages"]]
    return count_solutions_sat(data["size"], cages=cages, limit=limit)
