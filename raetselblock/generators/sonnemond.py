"""Sonne & Mond (Tango / Binairo-Variante).
Jede Zeile/Spalte gleich viele Sonnen (0) wie Monde (1), nie drei gleiche nebeneinander,
'=' zwischen Nachbarn: gleich, 'x': verschieden. Einige Felder vorgegeben.
"""
import itertools

# level -> n, Anzahl Zeichen im Pool, max. Logikstufe, min. Anzahl Stufe-2-Schritte, min. Vorgaben
LEVELS = {
    "beispiel": dict(n=4, signs=2, tier=1, min_t2=0, min_givens=6),
    "leicht": dict(n=6, signs=3, tier=1, min_t2=0, min_givens=12),
    "mittel": dict(n=6, signs=7, tier=2, min_t2=1, min_givens=5),
    "schwer": dict(n=6, signs=12, tier=2, min_t2=3, min_givens=0),
}


def _parse(data):
    n = data["size"]
    grid = [[None] * n for _ in range(n)]
    for r, c, v in data["givens"]:
        grid[r][c] = v
    signs = [((a, b), (c, d), s) for a, b, c, d, s in data["signs"]]
    return n, grid, signs


# ---------------------------------------------------------------- vollständiger Löser
def count_solutions(data, limit=2):
    n, grid, signs = _parse(data)
    half = n // 2
    rel = {}
    for x, y, s in signs:
        rel.setdefault(x, []).append((y, s))
        rel.setdefault(y, []).append((x, s))
    g = [row[:] for row in grid]
    order = [(r, c) for r in range(n) for c in range(n)]
    count = [0]

    def ok(r, c):
        v = g[r][c]
        row = g[r]
        if row.count(v) > half:
            return False
        col = [g[i][c] for i in range(n)]
        if col.count(v) > half:
            return False
        if c >= 2 and row[c - 1] == v and row[c - 2] == v:
            return False
        if r >= 2 and g[r - 1][c] == v and g[r - 2][c] == v:
            return False
        for (y, s) in rel.get((r, c), []):
            w = g[y[0]][y[1]]
            if w is not None and ((s == "=") != (w == v)):
                return False
        return True

    def rec(i):
        if count[0] >= limit:
            return
        if i == len(order):
            count[0] += 1
            return
        r, c = order[i]
        if g[r][c] is not None:
            # Vorgabe: trotzdem prüfen
            if ok(r, c):
                rec(i + 1)
            return
        for v in (0, 1):
            g[r][c] = v
            if ok(r, c):
                rec(i + 1)
            g[r][c] = None

    # Vorgaben selbst konsistent? (werden in rec beim Erreichen geprüft; Zeilenzähler
    # können Vorgaben weiter rechts noch nicht sehen -> zusätzlich Endprüfung via ok())
    rec(0)
    return count[0]


# ---------------------------------------------------------------- Logiklöser
def _lines(n):
    for r in range(n):
        yield [(r, c) for c in range(n)]
    for c in range(n):
        yield [(r, c) for r in range(n)]


def _line_completions(vals, n, inner):
    """Alle gültigen Belegungen einer Linie (Länge n) passend zu vals und inneren Zeichen."""
    half = n // 2
    out = []
    for bits in itertools.product((0, 1), repeat=n):
        if sum(bits) != half:
            continue
        if any(v is not None and v != b for v, b in zip(vals, bits)):
            continue
        if any(bits[i] == bits[i + 1] == bits[i + 2] for i in range(n - 2)):
            continue
        if any((bits[i] == bits[j]) != (s == "=") for i, j, s in inner):
            continue
        out.append(bits)
    return out


def logic_solve(data, max_tier=2):
    """Stufe 1: Paare, Lücken, volle Zeilen, Zeichen mit einem bekannten Nachbarn.
    Stufe 2: Zeile/Spalte als Ganzes durchdenken (alle Möglichkeiten der Linie inkl. Zeichen darin).
    Gibt (gelöst, Anzahl Stufe-2-Schritte) zurück."""
    n, grid, signs = _parse(data)
    half = n // 2
    g = [row[:] for row in grid]
    t2 = 0
    lines = list(_lines(n))

    def setv(x, v):
        if g[x[0]][x[1]] is None:
            g[x[0]][x[1]] = v
            return True
        return False

    while True:
        if all(v is not None for row in g for v in row):
            return True, t2
        changed = False
        # Stufe 1
        for x, y, s in signs:
            a, b = g[x[0]][x[1]], g[y[0]][y[1]]
            if a is not None and b is None:
                changed |= setv(y, a if s == "=" else 1 - a)
            elif b is not None and a is None:
                changed |= setv(x, b if s == "=" else 1 - b)
        for line in lines:
            vals = [g[r][c] for r, c in line]
            for v in (0, 1):
                if vals.count(v) == half:
                    for i, x in enumerate(line):
                        if vals[i] is None:
                            changed |= setv(x, 1 - v)
                    vals = [g[r][c] for r, c in line]
            for i in range(n - 1):
                if vals[i] is not None and vals[i] == vals[i + 1]:
                    if i - 1 >= 0 and vals[i - 1] is None:
                        changed |= setv(line[i - 1], 1 - vals[i])
                    if i + 2 < n and vals[i + 2] is None:
                        changed |= setv(line[i + 2], 1 - vals[i])
                    vals = [g[r][c] for r, c in line]
            for i in range(n - 2):
                if vals[i] is not None and vals[i] == vals[i + 2] and vals[i + 1] is None:
                    changed |= setv(line[i + 1], 1 - vals[i])
                    vals = [g[r][c] for r, c in line]
        if changed:
            continue
        if max_tier < 2:
            return False, t2
        # Stufe 2: eine Linie komplett durchdenken
        for line in lines:
            vals = [g[r][c] for r, c in line]
            if None not in vals:
                continue
            idx = {x: i for i, x in enumerate(line)}
            inner = [(idx[x], idx[y], s) for x, y, s in signs if x in idx and y in idx]
            comps = _line_completions(vals, n, inner)
            if not comps:
                return False, t2
            for i in range(n):
                if vals[i] is None and len({b[i] for b in comps}) == 1:
                    changed |= setv(line[i], comps[0][i])
            if changed:
                t2 += 1
                break
        if not changed:
            return False, t2


# ---------------------------------------------------------------- Generator
def _random_solution(n, rng):
    half = n // 2
    g = [[None] * n for _ in range(n)]

    def ok(r, c):
        v = g[r][c]
        if g[r][:c + 1].count(v) > half:
            return False
        if [g[i][c] for i in range(r + 1)].count(v) > half:
            return False
        if c >= 2 and g[r][c - 1] == v == g[r][c - 2]:
            return False
        if r >= 2 and g[r - 1][c] == v == g[r - 2][c]:
            return False
        return True

    def rec(i):
        if i == n * n:
            return True
        r, c = divmod(i, n)
        vs = [0, 1]
        rng.shuffle(vs)
        for v in vs:
            g[r][c] = v
            if ok(r, c) and rec(i + 1):
                return True
        g[r][c] = None
        return False

    rec(0)
    return g


def generate(level, rng):
    cfg = LEVELS[level]
    n = cfg["n"]
    while True:
        sol = _random_solution(n, rng)
        edges = [((r, c), (r, c + 1)) for r in range(n) for c in range(n - 1)] + \
                [((r, c), (r + 1, c)) for r in range(n - 1) for c in range(n)]
        rng.shuffle(edges)
        # Zeichen nicht zu dicht: höchstens eins pro Feld
        chosen, used = [], set()
        for x, y in edges:
            if len(chosen) >= cfg["signs"]:
                break
            if x in used or y in used:
                continue
            chosen.append([x[0], x[1], y[0], y[1], "=" if sol[x[0]][x[1]] == sol[y[0]][y[1]] else "x"])
            used |= {x, y}
        givens = [[r, c, sol[r][c]] for r in range(n) for c in range(n)]
        rng.shuffle(givens)

        def data_of(gv, sg):
            return {"size": n, "givens": sorted(gv), "signs": sorted(sg)}

        # Vorgaben entfernen, solange logisch lösbar
        for gv in list(givens):
            if len(givens) <= cfg["min_givens"]:
                break
            trial = [x for x in givens if x != gv]
            if logic_solve(data_of(trial, chosen), cfg["tier"])[0]:
                givens = trial
        # überflüssige Zeichen entfernen (nur bei leicht/beispiel, dort sollen es wenige sein)
        given_cells = {(r, c) for r, c, _ in givens}
        chosen = [s for s in chosen if not ((s[0], s[1]) in given_cells and (s[2], s[3]) in given_cells)]
        if level in ("beispiel", "leicht"):
            for s in list(chosen):
                trial = [x for x in chosen if x != s]
                if logic_solve(data_of(givens, trial), cfg["tier"])[0]:
                    chosen = trial
        data = data_of(givens, chosen)
        ok, t2 = logic_solve(data, cfg["tier"])
        if not ok or t2 < cfg["min_t2"]:
            continue
        if level == "beispiel" and not chosen:
            continue
        if level in ("mittel", "schwer") and len(chosen) < cfg["signs"] - 3:
            continue
        if count_solutions(data) != 1:
            continue
        return {"data": data, "solution": {"grid": sol}}
