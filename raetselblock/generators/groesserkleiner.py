"""Größer – Kleiner (Prinzip Futoshiki): lateinisches Quadrat mit < / > zwischen Nachbarzellen.

Erzeugung: Lösung würfeln, mit vielen Zeichen + Vorgaben starten, dann in zufälliger
Reihenfolge Vorgaben und Zeichen entfernen, solange der logische Löser (mit den für die
Stufe erlaubten Techniken) das Rätsel noch komplett löst.
"""
from .latin_core import LogicSolver, count_solutions_sat, random_latin

LEVELS = {
    # n, erlaubte Techniken, (min, max) Vorgaben, Anteil Zeichen am Start, Pflicht-Technik, min. Zeichen
    "beispiel": dict(n=4, tech=("single", "ineq"), keep_givens=(3, 5), sign_frac=0.6, req=None,
                     min_signs=4),
    "leicht": dict(n=4, tech=("single", "ineq"), keep_givens=(3, 4), sign_frac=0.5, req=None,
                   min_signs=4),
    "mittel": dict(n=5, tech=("single", "ineq", "hidden"), keep_givens=(2, 4), sign_frac=0.5,
                   req="hidden", min_signs=6),
    "schwer": dict(n=6, tech=("single", "ineq", "hidden", "pairs"), keep_givens=(0, 2),
                   sign_frac=0.6, req="hidden", min_signs=12),
}


def _pairs(n):
    out = []
    for r in range(n):
        for c in range(n):
            if c + 1 < n:
                out.append(((r, c), (r, c + 1)))
            if r + 1 < n:
                out.append(((r, c), (r + 1, c)))
    return out


def _solver(n, givens, signs, sol):
    lts = []
    for a, b in signs:
        ia, ib = a[0] * n + a[1], b[0] * n + b[1]
        lts.append((ia, ib) if sol[a[0]][a[1]] < sol[b[0]][b[1]] else (ib, ia))
    return LogicSolver(n, givens={r * n + c: sol[r][c] for r, c in givens}, lts=lts)


def _attempt(level, rng):
    cfg = LEVELS[level]
    n, tech = cfg["n"], cfg["tech"]
    sol = random_latin(n, rng)
    allp = _pairs(n)
    rng.shuffle(allp)
    signs = set(allp[:int(len(allp) * cfg["sign_frac"])])
    givens = {(r, c) for r in range(n) for c in range(n)}

    def ok(g, s):
        return _solver(n, g, s, sol).solve(tech)[0]

    if not ok(givens, signs):
        return None
    lo, hi = cfg["keep_givens"]
    # Vorgaben zuerst ausdünnen (bis auf 'lo'), dann Zeichen; danach nochmal Vorgaben
    for _ in range(2):
        for cell in rng.sample(sorted(givens), len(givens)):
            if len(givens) <= lo:
                break
            if ok(givens - {cell}, signs):
                givens = givens - {cell}
        for s in rng.sample(sorted(signs), len(signs)):
            if len(signs) <= cfg["min_signs"]:
                break
            if ok(givens, signs - {s}):
                signs = signs - {s}
    if len(givens) > hi:
        return None
    # beide Zeichenrichtungen (waagerecht und senkrecht) sollen vorkommen
    if len({a[0] == b[0] for a, b in signs}) < 2:
        return None
    if cfg["req"]:
        easier = tech[:tech.index(cfg["req"])]
        if _solver(n, givens, signs, sol).solve(easier)[0]:
            return None
    if level == "schwer":
        st = _solver(n, givens, signs, sol).solve(tech)[2]
        if st["hidden"] + 2 * st["pairs"] < 3:
            return None
    return sol, givens, signs


def generate(level, rng):
    while True:
        res = _attempt(level, rng)
        if not res:
            continue
        sol, givens, signs = res
        n = LEVELS[level]["n"]
        gv = [[sol[r][c] if (r, c) in givens else 0 for c in range(n)] for r in range(n)]
        # Zeichen als [r, c, Richtung, Relation]: Richtung "h" = zu (r, c+1), "v" = zu (r+1, c);
        # Relation "<": Wert(r,c) < Nachbar, ">": größer.
        sg = []
        for a, b in sorted(signs):
            d = "h" if a[0] == b[0] else "v"
            rel = "<" if sol[a[0]][a[1]] < sol[b[0]][b[1]] else ">"
            sg.append([a[0], a[1], d, rel])
        data = {"size": n, "givens": gv, "signs": sg}
        assert count_solutions(data) == 1
        return {"data": data, "solution": {"grid": sol}}


def count_solutions(data, limit=2):
    n = data["size"]
    givens = {(r, c): v for r in range(n) for c in range(n) if (v := data["givens"][r][c])}
    lts = []
    for r, c, d, rel in data["signs"]:
        a, b = (r, c), ((r, c + 1) if d == "h" else (r + 1, c))
        lts.append((a, b) if rel == "<" else (b, a))
    return count_solutions_sat(n, givens=givens, lts=lts, limit=limit)
