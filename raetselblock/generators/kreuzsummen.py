"""Kreuzsummen (Kakuro): weiße Felder bekommen Ziffern 1-9, Hinweisfelder geben die Summe des
Abschnitts rechts davon bzw. darunter an. In einem Abschnitt keine Ziffer doppelt.

data = {"size": N,                      # quadratisches Gitter inkl. Hinweisrand (Zeile 0/Spalte 0)
        "cells": N x N,                 # 0 = weißes Feld, [unten, rechts] = Hinweisfeld (0 = keine Summe)
        "givens": [[r, c, v], ...]}     # vorgegebene Ziffern (normalerweise leer)
solution = {"grid": N x N}               # Ziffern, 0 in Hinweisfeldern
"""
import itertools

DIG = range(1, 10)

# Kombinationen: (Länge, Summe) -> Liste von frozensets
COMBOS = {}
for _L in range(1, 10):
    for _c in itertools.combinations(DIG, _L):
        COMBOS.setdefault((_L, sum(_c)), []).append(frozenset(_c))

LEVELS = {
    # n = Innenbereich, white = Anzahl weißer Felder, simple = reine Mengen-Logik genügt,
    # uniq = Mindestanteil Abschnitte mit eindeutiger Zerlegung, need4 = min. Abschnitte der Länge 4
    "beispiel": dict(n=3, maxrun=3, minrun=2, white=(7, 8), simple=True, uniq=0.75),
    "leicht":   dict(n=4, maxrun=3, minrun=2, white=(9, 10), simple=True, uniq=0.6),
    "mittel":   dict(n=5, maxrun=4, minrun=2, white=(12, 16), simple=False, uniq=0.0, max4=1),
    "schwer":   dict(n=6, maxrun=4, minrun=2, white=(21, 28), simple=False, uniq=0.0, need4=3),
}


# ---------------------------------------------------------------- Struktur
def runs_of(white, N):
    """Liste von Abschnitten: (clue_cell, dir, [cells]); dir 0 = rechts, 1 = unten."""
    runs = []
    for r in range(N):
        c = 0
        while c < N:
            if white[r][c]:
                s = c
                while c < N and white[r][c]:
                    c += 1
                runs.append(((r, s - 1), 0, [(r, x) for x in range(s, c)]))
            else:
                c += 1
    for c in range(N):
        r = 0
        while r < N:
            if white[r][c]:
                s = r
                while r < N and white[r][c]:
                    r += 1
                runs.append(((s - 1, c), 1, [(x, c) for x in range(s, r)]))
            else:
                r += 1
    return runs


def _data_runs(data):
    N = data["size"]
    cells = data["cells"]
    white = [[cells[r][c] == 0 for c in range(N)] for r in range(N)]
    out = []
    for (cr, cc), d, run in runs_of(white, N):
        s = cells[cr][cc][1] if d == 0 else cells[cr][cc][0]
        out.append((run, s))
    return white, out


# ---------------------------------------------------------------- Logik
def _run_filter(run, S, dom, simple):
    """Liefert neue Domänen für die Zellen eines Abschnitts (oder None bei Widerspruch)."""
    L = len(run)
    ds = [dom[x] for x in run]
    if simple:
        fixed = {next(iter(d)) for d in ds if len(d) == 1}
        allowed = set().union(*ds)
        ok = [cb for cb in COMBOS.get((L, S), []) if fixed <= cb and cb <= allowed]
        if not ok:
            return None
        u = set().union(*ok)
        new = []
        for d in ds:
            nd = d & u
            if len(d) > 1:
                nd -= fixed
            new.append(nd)
        return new
    sup = [set() for _ in range(L)]
    for cb in COMBOS.get((L, S), []):
        for perm in itertools.permutations(cb):
            if all(perm[i] in ds[i] for i in range(L)):
                for i in range(L):
                    sup[i].add(perm[i])
    return sup


def propagate(runs, dom, simple=False):
    """Kombinations-Elimination bis zum Fixpunkt. False bei Widerspruch."""
    changed = True
    while changed:
        changed = False
        for run, S in runs:
            new = _run_filter(run, S, dom, simple)
            if new is None:
                return False
            for x, nd in zip(run, new):
                if not nd:
                    return False
                if nd != dom[x]:
                    dom[x] = nd
                    changed = True
    return True


def _init_dom(data, white):
    N = data["size"]
    dom = {(r, c): set(DIG) for r in range(N) for c in range(N) if white[r][c]}
    for r, c, v in data.get("givens", []):
        dom[(r, c)] = {v}
    return dom


def logic_solve(data, simple=False):
    white, runs = _data_runs(data)
    dom = _init_dom(data, white)
    if not propagate(runs, dom, simple):
        return False, dom
    return all(len(d) == 1 for d in dom.values()), dom


# ---------------------------------------------------------------- Zählen (Backtracking)
def count_solutions(data, limit=2):
    white, runs = _data_runs(data)
    dom = _init_dom(data, white)
    cell_runs = {}
    for run, S in runs:
        for x in run:
            cell_runs.setdefault(x, []).append((run, S))
    found = [0]

    def rec(dom):
        if found[0] >= limit:
            return
        if not propagate(runs, dom):
            return
        open_ = [x for x in dom if len(dom[x]) > 1]
        if not open_:
            # Endprüfung (Summen und Verschiedenheit)
            for run, S in runs:
                vals = [next(iter(dom[x])) for x in run]
                if sum(vals) != S or len(set(vals)) != len(vals):
                    return
            found[0] += 1
            return
        x = min(open_, key=lambda y: len(dom[y]))
        for v in sorted(dom[x]):
            nd = {k: set(s) for k, s in dom.items()}
            nd[x] = {v}
            rec(nd)
            if found[0] >= limit:
                return

    rec(dom)
    return found[0]


# ---------------------------------------------------------------- Muster
def _pattern_ok(white, N, cfg):
    runs = runs_of(white, N)
    if not runs:
        return False
    for _, _, run in runs:
        if not (cfg["minrun"] <= len(run) <= cfg["maxrun"]):
            return False
    n4 = sum(len(r) == 4 for _, _, r in runs)
    if n4 < cfg.get("need4", 0) or n4 > cfg.get("max4", 99):
        return False
    # Innenbereich ganz nutzen: jede Zeile und Spalte hat weiße Felder
    if not all(any(white[r][1:]) for r in range(1, N)):
        return False
    if not all(any(white[r][c] for r in range(1, N)) for c in range(1, N)):
        return False
    cells = [(r, c) for r in range(N) for c in range(N) if white[r][c]]
    lo, hi = cfg["white"]
    if not (lo <= len(cells) <= hi):
        return False
    # zusammenhängend
    seen = {cells[0]}
    stack = [cells[0]]
    while stack:
        r, c = stack.pop()
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < N and 0 <= nc < N and white[nr][nc] and (nr, nc) not in seen:
                seen.add((nr, nc))
                stack.append((nr, nc))
    return len(seen) == len(cells)


_PATTERNS = {}


def _all_patterns(n, minrun, maxrun):
    """Alle n x n-Innenmuster, deren waagerechte und senkrechte Abschnitte Länge
    minrun..maxrun haben (zeilenweise DFS mit Spaltenlängen-Pruning). Gecacht."""
    key = (n, minrun, maxrun)
    if key in _PATTERNS:
        return _PATTERNS[key]
    rows = []
    for bits in itertools.product((0, 1), repeat=n):
        ok, L = True, 0
        for b in bits + (0,):
            if b:
                L += 1
            else:
                if L and not (minrun <= L <= maxrun):
                    ok = False
                L = 0
        if ok:
            rows.append(bits)
    res = []

    def rec(acc, colL):
        if len(acc) == n:
            if all(L == 0 or minrun <= L <= maxrun for L in colL):
                res.append(tuple(acc))
            return
        for p in rows:
            nl = []
            for c in range(n):
                if p[c]:
                    l = colL[c] + 1
                    if l > maxrun:
                        break
                else:
                    if colL[c] and colL[c] < minrun:
                        break
                    l = 0
                nl.append(l)
            else:
                rec(acc + [p], nl)

    rec([], [0] * n)
    _PATTERNS[key] = res
    return res


_FILTERED = {}


def _patterns_for(level):
    if level not in _FILTERED:
        cfg = LEVELS[level]
        n = cfg["n"]
        N = n + 1
        out = []
        for pat in _all_patterns(n, cfg["minrun"], cfg["maxrun"]):
            white = [[False] * N] + [[False] + [bool(b) for b in row] for row in pat]
            if _pattern_ok(white, N, cfg):
                out.append(white)
        _FILTERED[level] = out
    return _FILTERED[level]


def _random_pattern(level, rng):
    return [row[:] for row in rng.choice(_patterns_for(level))]


# ---------------------------------------------------------------- Füllen + lokale Suche
def _random_fill(white, N, runs, rng, small_bias):
    cells = [(r, c) for r in range(N) for c in range(N) if white[r][c]]
    cell_runs = {x: [] for x in cells}
    for _, _, run in runs:
        for x in run:
            cell_runs[x].append(run)
    sol = {}

    def order_digits():
        d = list(DIG)
        rng.shuffle(d)
        if small_bias:
            d.sort(key=lambda v: min(v, 10 - v) + rng.random() * 3)
        return d

    def rec(i):
        if i == len(cells):
            return True
        x = cells[i]
        used = {sol[y] for run in cell_runs[x] for y in run if y in sol}
        for v in order_digits():
            if v not in used:
                sol[x] = v
                if rec(i + 1):
                    return True
                del sol[x]
        return False

    return sol if rec(0) else None


def _make_data(white, N, sol):
    cells = [[0 if white[r][c] else [0, 0] for c in range(N)] for r in range(N)]
    for (cr, cc), d, run in runs_of(white, N):
        s = sum(sol[x] for x in run)
        if d == 0:
            cells[cr][cc][1] = s
        else:
            cells[cr][cc][0] = s
    return {"size": N, "cells": cells, "givens": []}


def _uniq_share(data):
    _, runs = _data_runs(data)
    return sum(len(COMBOS[(len(r), s)]) == 1 for r, s in runs) / len(runs)


def _score(data, cfg):
    ok, dom = logic_solve(data, simple=cfg["simple"])
    open_cells = [x for x, d in dom.items() if len(d) > 1]
    sc = sum(len(dom[x]) - 1 for x in open_cells)
    if not ok and not open_cells:
        sc = 99  # Widerspruch (sollte nicht vorkommen)
    pen = max(0.0, cfg["uniq"] - _uniq_share(data))
    return sc + 10 * pen, open_cells


def generate(level, rng):
    cfg = LEVELS[level]
    N = cfg["n"] + 1
    while True:
        white = _random_pattern(level, rng)
        runs = runs_of(white, N)
        sol = _random_fill(white, N, runs, rng, small_bias=cfg["simple"])
        if sol is None:
            continue
        cell_runs = {}
        for _, _, run in runs:
            for x in run:
                cell_runs.setdefault(x, []).append(run)
        data = _make_data(white, N, sol)
        score, open_cells = _score(data, cfg)
        allcells = list(sol)
        for it in range(250):
            if score == 0:
                break
            pool = open_cells if open_cells and rng.random() < 0.8 else allcells
            x = rng.choice(pool)
            used = {sol[y] for run in cell_runs[x] for y in run if y != x}
            best = None
            for v in DIG:
                if v in used or v == sol[x]:
                    continue
                old = sol[x]
                sol[x] = v
                d2 = _make_data(white, N, sol)
                s2, oc2 = _score(d2, cfg)
                sol[x] = old
                if best is None or s2 < best[0] or (s2 == best[0] and rng.random() < 0.5):
                    best = (s2, v, d2, oc2)
            if best and (best[0] <= score or rng.random() < 0.1):
                score, v, data, open_cells = best
                sol[x] = v
        if score != 0:
            continue
        if count_solutions(data) != 1:
            continue
        if level == "schwer" and logic_solve(data, simple=True)[0]:
            continue  # schwer: einfache Mengen-Elimination reicht nicht
        grid = [[sol.get((r, c), 0) for c in range(N)] for r in range(N)]
        return {"data": data, "solution": {"grid": grid}}
