"""Nonogramm-Kern: Hinweise, Line-Solver (reine Zeilen-/Spaltenlogik) und SAT-Zähler."""
from pysat.solvers import Cadical153


def clues_of(line):
    out, run = [], 0
    for v in line:
        if v:
            run += 1
        elif run:
            out.append(run)
            run = 0
    if run:
        out.append(run)
    return out


def grid_clues(grid):
    rows = [clues_of(r) for r in grid]
    cols = [clues_of([grid[r][c] for r in range(len(grid))]) for c in range(len(grid[0]))]
    return rows, cols


# ---------------------------------------------------------------- Line-Solver
def line_solve(clues, known):
    """known: Liste mit -1 (unbekannt), 0, 1. Gibt neue Liste zurück oder None (Widerspruch).
    Ergebnis = Schnittmenge aller mit known verträglichen Platzierungen."""
    n, k = len(known), len(clues)
    memo = {}

    def can(i, j):
        key = (i, j)
        if key in memo:
            return memo[key]
        if j == k:
            r = all(known[x] != 1 for x in range(i, n))
        else:
            r = False
            if i < n and known[i] != 1 and can(i + 1, j):
                r = True
            if not r:
                b = clues[j]
                e = i + b
                if e <= n and all(known[x] != 0 for x in range(i, e)) and (e == n or known[e] != 1):
                    if can(min(e + 1, n), j + 1) if e < n else can(n, j + 1):
                        r = True
        memo[key] = r
        return r

    if not can(0, 0):
        return None
    can_fill = [False] * n
    can_empty = [False] * n
    states = {(0, 0)}
    for i in range(n + 1):
        for j in range(k + 1):
            if (i, j) not in states or not can(i, j):
                continue
            if j == k:
                for x in range(i, n):
                    can_empty[x] = True
                continue
            if i < n and known[i] != 1 and can(i + 1, j):
                can_empty[i] = True
                states.add((i + 1, j))
            b = clues[j]
            e = i + b
            if e <= n and all(known[x] != 0 for x in range(i, e)) and (e == n or known[e] != 1):
                nxt = (min(e + 1, n), j + 1)
                if can(*nxt):
                    for x in range(i, e):
                        can_fill[x] = True
                    if e < n:
                        can_empty[e] = True
                    states.add(nxt)
    out = []
    for x in range(n):
        if can_fill[x] and not can_empty[x]:
            out.append(1)
        elif can_empty[x] and not can_fill[x]:
            out.append(0)
        else:
            out.append(-1)
    return out


def logic_solve(row_clues, col_clues):
    """Iterativer Line-Solver. Rückgabe (grid mit -1/0/1 oder None, Anzahl Durchgänge)."""
    H, W = len(row_clues), len(col_clues)
    g = [[-1] * W for _ in range(H)]
    dirty_r, dirty_c = set(range(H)), set(range(W))
    passes = 0
    while dirty_r or dirty_c:
        passes += 1
        for r in sorted(dirty_r):
            res = line_solve(row_clues[r], g[r])
            if res is None:
                return None, passes
            for c in range(W):
                if res[c] != g[r][c]:
                    g[r][c] = res[c]
                    dirty_c.add(c)
        dirty_r = set()
        for c in sorted(dirty_c):
            col = [g[r][c] for r in range(H)]
            res = line_solve(col_clues[c], col)
            if res is None:
                return None, passes
            for r in range(H):
                if res[r] != g[r][c]:
                    g[r][c] = res[r]
                    dirty_r.add(r)
        dirty_c = set()
    return g, passes


def line_solvable(grid):
    rc, cc = grid_clues(grid)
    g, passes = logic_solve(rc, cc)
    return g is not None and all(v != -1 for row in g for v in row), passes, g


# ---------------------------------------------------------------- SAT-Zähler
def count_sat(row_clues, col_clues, limit=2):
    H, W = len(row_clues), len(col_clues)
    nv = [0]

    def new():
        nv[0] += 1
        return nv[0]

    x = [[new() for _ in range(W)] for _ in range(H)]
    s = Cadical153()

    def encode(clues, cells):
        n = len(cells)
        k = len(clues)
        if k == 0:
            for v in cells:
                s.add_clause([-v])
            return
        starts = []
        for t in range(k):
            lo = sum(clues[:t]) + t
            hi = n - (sum(clues[t:]) + (k - 1 - t))
            if hi < lo:
                s.add_clause([])
                return
            starts.append({p: new() for p in range(lo, hi + 1)})
        for t in range(k):
            vs = list(starts[t].values())
            s.add_clause(vs)
            for a in range(len(vs)):
                for b in range(a + 1, len(vs)):
                    s.add_clause([-vs[a], -vs[b]])
            if t + 1 < k:
                for p, v in starts[t].items():
                    s.add_clause([-v] + [w for q, w in starts[t + 1].items() if q >= p + clues[t] + 1])
        cover = [[] for _ in range(n)]
        for t in range(k):
            for p, v in starts[t].items():
                for c in range(p, p + clues[t]):
                    cover[c].append(v)
                    s.add_clause([-v, cells[c]])
        for c in range(n):
            s.add_clause([-cells[c]] + cover[c])

    for r in range(H):
        encode(row_clues[r], x[r])
    for c in range(W):
        encode(col_clues[c], [x[r][c] for r in range(H)])
    cnt = 0
    while cnt < limit and s.solve():
        cnt += 1
        m = set(l for l in s.get_model() if l > 0)
        s.add_clause([-x[r][c] if x[r][c] in m else x[r][c] for r in range(H) for c in range(W)])
    s.delete()
    return cnt
