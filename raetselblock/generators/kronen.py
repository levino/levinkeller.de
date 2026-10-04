"""Kronen (Queens / Star Battle 1★): n×n Gitter, n Gebiete.
Genau eine Krone pro Zeile, Spalte und Gebiet; Kronen berühren sich nie (auch nicht schräg).
"""
import itertools

# level -> (Größen, max. Logikstufe, min. Logikstufe)
LEVELS = {
    "beispiel": ([5], 1, 1),
    "leicht": ([5, 6], 2, 1),
    "mittel": ([7], 3, 2),
    "schwer": ([8], 4, 3),
}


# ---------------------------------------------------------------- vollständiger Löser
def _solve(regions, limit=2):
    n = len(regions)
    sols = []
    cols = [False] * n
    regs = [False] * n
    cur = []

    def rec(r):
        if len(sols) >= limit:
            return
        if r == n:
            sols.append(list(cur))
            return
        for c in range(n):
            if cols[c] or regs[regions[r][c]]:
                continue
            if cur and abs(cur[-1] - c) <= 1:
                continue
            cols[c] = True
            regs[regions[r][c]] = True
            cur.append(c)
            rec(r + 1)
            cur.pop()
            cols[c] = False
            regs[regions[r][c]] = False

    rec(0)
    return sols


def count_solutions(data, limit=2):
    regions = data["regions"]
    n = len(regions)
    if len({x for row in regions for x in row}) != n:
        return 0
    return len(_solve(regions, limit))


# ---------------------------------------------------------------- Logiklöser
def logic_solve(regions, max_tier=4):
    """Menschliche Schlussregeln. Gibt (gelöst?, höchste benutzte Stufe) zurück.
    Stufe 1: Krone setzen streicht Zeile/Spalte/Gebiet/Nachbarn; letzte freie Stelle einer Einheit.
    Stufe 2: Gebiet liegt ganz in einer Zeile/Spalte (oder umgekehrt) -> Rest streichen.
    Stufe 3: Feld, dessen Krone eine ganze Einheit blockieren würde, streichen.
    Stufe 4: k Gebiete liegen ganz in k Zeilen/Spalten (k=2,3)."""
    n = len(regions)
    cells = [(r, c) for r in range(n) for c in range(n)]
    cand = set(cells)
    crowns = set()
    units = []
    for r in range(n):
        units.append(("row", r, [(r, c) for c in range(n)]))
    for c in range(n):
        units.append(("col", c, [(r, c) for r in range(n)]))
    for g in range(n):
        units.append(("reg", g, [x for x in cells if regions[x[0]][x[1]] == g]))

    def neigh(x):
        r, c = x
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                if (dr or dc) and 0 <= r + dr < n and 0 <= c + dc < n:
                    yield (r + dr, c + dc)

    def place(x):
        crowns.add(x)
        r, c = x
        g = regions[r][c]
        for y in list(cand):
            if y[0] == r or y[1] == c or regions[y[0]][y[1]] == g or y in set(neigh(x)):
                cand.discard(y)

    def unit_done(u):
        return any(x in crowns for x in u[2])

    used = 0
    while len(crowns) < n:
        progress = False
        # Stufe 1
        for u in units:
            if unit_done(u):
                continue
            cs = [x for x in u[2] if x in cand]
            if not cs:
                return False, used
            if len(cs) == 1:
                place(cs[0])
                used = max(used, 1)
                progress = True
                break
        if progress:
            continue
        if max_tier < 2:
            break
        # Stufe 2: Einschluss k=1
        for u in units:
            if unit_done(u):
                continue
            cs = [x for x in u[2] if x in cand]
            for kind in ("row", "col", "reg"):
                if kind == u[0]:
                    continue
                key = (lambda x: x[0]) if kind == "row" else (lambda x: x[1]) if kind == "col" else (lambda x: regions[x[0]][x[1]])
                ks = {key(x) for x in cs}
                if len(ks) == 1:
                    k = ks.pop()
                    rm = [y for y in cand if key(y) == k and y not in cs]
                    if rm:
                        for y in rm:
                            cand.discard(y)
                        used = max(used, 2)
                        progress = True
                        break
            if progress:
                break
        if progress:
            continue
        if max_tier < 3:
            break
        # Stufe 3: Feld blockiert eine ganze Einheit
        for x in sorted(cand):
            r, c = x
            g = regions[r][c]
            hit = set(neigh(x)) | {y for y in cand if y[0] == r or y[1] == c or regions[y[0]][y[1]] == g}
            for u in units:
                if unit_done(u) or x in u[2]:
                    continue
                cs = [y for y in u[2] if y in cand]
                if all(y in hit for y in cs):
                    cand.discard(x)
                    used = max(used, 3)
                    progress = True
                    break
            if progress:
                break
        if progress:
            continue
        if max_tier < 4:
            break
        # Stufe 4: k Gebiete in k Zeilen/Spalten (und umgekehrt)
        for k in (2, 3):
            for a_kind, b_kind in (("reg", "row"), ("reg", "col"), ("row", "reg"), ("col", "reg")):
                key = (lambda x: x[0]) if b_kind == "row" else (lambda x: x[1]) if b_kind == "col" else (lambda x: regions[x[0]][x[1]])
                open_units = [u for u in units if u[0] == a_kind and not unit_done(u)]
                for combo in itertools.combinations(open_units, k):
                    cs = set()
                    for u in combo:
                        cs |= {x for x in u[2] if x in cand}
                    ks = {key(x) for x in cs}
                    if len(ks) == k:
                        rm = [y for y in cand if key(y) in ks and y not in cs]
                        if rm:
                            for y in rm:
                                cand.discard(y)
                            used = max(used, 4)
                            progress = True
                            break
                if progress:
                    break
            if progress:
                break
        if not progress:
            break
    return len(crowns) == n, used


# ---------------------------------------------------------------- Generator
def _random_crowns(n, rng):
    perm = []

    def rec(r):
        if r == n:
            return True
        opts = [c for c in range(n) if c not in perm and (not perm or abs(perm[-1] - c) > 1)]
        rng.shuffle(opts)
        for c in opts:
            perm.append(c)
            if rec(r + 1):
                return True
            perm.pop()
        return False

    rec(0)
    return perm


def _orth(x, n):
    r, c = x
    for dr, dc in ((0, 1), (1, 0), (0, -1), (-1, 0)):
        if 0 <= r + dr < n and 0 <= c + dc < n:
            yield (r + dr, c + dc)


def _grow(n, crowns, rng):
    reg = [[-1] * n for _ in range(n)]
    for g, c in enumerate(crowns):
        reg[g][c] = g
    # unterschiedliche Wachstumsraten -> kleine und große Gebiete
    rate = [rng.choice([0.3, 1, 1, 2, 3]) for _ in range(n)]
    left = n * n - n
    while left:
        g = rng.choices(range(n), weights=rate)[0]
        front = [y for r in range(n) for c in range(n) if reg[r][c] == g
                 for y in _orth((r, c), n) if reg[y[0]][y[1]] == -1]
        if not front:
            rate[g] = 1e-9 if any(reg[r][c] == -1 for r in range(n) for c in range(n)) else rate[g]
            if all(w < 1e-6 for w in rate):
                return None
            continue
        y = rng.choice(front)
        reg[y[0]][y[1]] = g
        left -= 1
    return reg


def _connected_without(reg, g, x, n):
    cells = [(r, c) for r in range(n) for c in range(n) if reg[r][c] == g and (r, c) != x]
    if not cells:
        return False
    seen = {cells[0]}
    st = [cells[0]]
    cs = set(cells)
    while st:
        y = st.pop()
        for z in _orth(y, n):
            if z in cs and z not in seen:
                seen.add(z)
                st.append(z)
    return len(seen) == len(cells)


def _make_unique(n, crowns, reg, rng, steps=60):
    crown_cells = {(r, c) for r, c in enumerate(crowns)}
    for _ in range(steps):
        sols = _solve(reg, limit=2)
        others = [s for s in sols if s != crowns]
        if not others:
            return reg
        s2 = others[0]
        diff = [(r, s2[r]) for r in range(n) if s2[r] != crowns[r]]
        rng.shuffle(diff)
        moved = False
        for x in diff:
            if x in crown_cells:
                continue
            g = reg[x[0]][x[1]]
            nbr_regs = {reg[y[0]][y[1]] for y in _orth(x, n)} - {g}
            nbr_regs = list(nbr_regs)
            rng.shuffle(nbr_regs)
            if not nbr_regs or not _connected_without(reg, g, x, n):
                continue
            reg[x[0]][x[1]] = nbr_regs[0]
            moved = True
            break
        if not moved:
            return None
    return None


def generate(level, rng):
    sizes, max_tier, min_tier = LEVELS[level]
    while True:
        n = rng.choice(sizes)
        crowns = _random_crowns(n, rng)
        reg = _grow(n, crowns, rng)
        if reg is None:
            continue
        reg = _make_unique(n, crowns, reg, rng)
        if reg is None:
            continue
        sizes_r = [sum(row.count(g) for row in reg) for g in range(n)]
        if level != "beispiel" and max(sizes_r) > 2.6 * n:
            continue
        ok, used = logic_solve(reg, max_tier)
        if not ok or used < min_tier:
            continue
        data = {"size": n, "regions": reg}
        assert count_solutions(data) == 1
        return {"data": data, "solution": {"crowns": [[r, c] for r, c in enumerate(crowns)]}}
