"""Zauberquadrate: jede Zeile, Spalte und beide Diagonalen haben dieselbe Summe.

data = {
  "size":    3 | 4,
  "numbers": [...],            # Zahlenvorrat, jede Zahl genau einmal (wird als Kärtchenreihe gezeigt)
  "sum":     int | 0,          # Zauberzahl, 0 = nicht angezeigt (muss selbst gefunden werden)
  "givens":  [[...], ...],     # 0 = leer
}
solution = {"grid": [[...]], "sum": S}

Menschlicher Löser (Stufe = größte Zahl leerer Felder einer Linie, die man betrachten muss):
  1 = Linie mit nur einem leeren Feld ausrechnen
  2 = Linie mit zwei leeren Feldern: welche zwei übrigen Zahlen passen? (+ einzige mögliche Stelle)
  3 = Linie mit drei leeren Feldern
Stufen:
  beispiel 3x3, 1-9, Summe 15 gegeben, 5-6 Vorgaben, nur Stufe 1
  leicht   3x3, 1-9, Summe gegeben, 3-4 Vorgaben, Stufe 1 (mindestens 3 Schritte)
  mittel   3x3, andere Zahlen (gerade 2-18, 5-13, ungerade 1-17, 10-18 …), 3 Vorgaben + Summe,
           braucht Stufe 2 – oder Summe nicht gegeben, eine volle Linie vorgegeben
  schwer   4x4, 1-16, Summe 34, so wenige Vorgaben, wie der Löser mit Stufe <= 3 noch schafft
"""
import itertools

LO_SHU = [[2, 7, 6], [9, 5, 1], [4, 3, 8]]

NUMBER_SETS_3 = [  # (a, b): Zahl = a * k + b für k = 1..9
    (2, 0),    # 2, 4, ..., 18
    (1, 4),    # 5 .. 13
    (2, -1),   # 1, 3, ..., 17
    (1, 9),    # 10 .. 18
    (1, 2),    # 3 .. 11
    (3, 0),    # 3, 6, ..., 27
]


def lines(n):
    ls = [[(r, c) for c in range(n)] for r in range(n)]
    ls += [[(r, c) for r in range(n)] for c in range(n)]
    ls.append([(i, i) for i in range(n)])
    ls.append([(i, n - 1 - i) for i in range(n)])
    return ls


# ---------------------------------------------------------------- unabhängiger Zähler
def count_solutions(data, limit=2):
    n = data["size"]
    nums = sorted(data["numbers"])
    S = data["sum"] or sum(nums) // n   # Summe folgt zwingend aus dem Zahlenvorrat
    if sum(nums) != S * n:
        return 0
    g = [row[:] for row in data["givens"]]
    used = {v for row in g for v in row if v}
    free = [x for x in nums if x not in used]
    cells = [(r, c) for r in range(n) for c in range(n) if g[r][c] == 0]
    LS = lines(n)
    by_cell = {(r, c): [l for l in LS if (r, c) in l] for r in range(n) for c in range(n)}
    count = 0
    avail = set(free)
    lo_sorted = sorted(free)

    def line_ok(l):
        vals = [g[r][c] for r, c in l]
        empties = vals.count(0)
        s = sum(vals)
        if empties == 0:
            return s == S
        rest = S - s
        a = sorted(avail)
        if len(a) < empties:
            return False
        return sum(a[:empties]) <= rest <= sum(a[-empties:])

    def rec(i):
        nonlocal count
        if i == len(cells):
            count += 1
            return count >= limit
        r, c = cells[i]
        for v in lo_sorted:
            if v not in avail:
                continue
            g[r][c] = v
            avail.discard(v)
            if all(line_ok(l) for l in by_cell[(r, c)]):
                if rec(i + 1):
                    return True
            avail.add(v)
            g[r][c] = 0
        return False

    rec(0)
    return count


# ---------------------------------------------------------------- menschlicher Löser
def _subset_exists(pool, k, target, exclude):
    pool = [x for x in pool if x not in exclude]
    for comb in itertools.combinations(pool, k):
        if sum(comb) == target:
            return True
    return False


def human_solve(n, numbers, S, givens, maxL):
    """Rückgabe (gelöst?, größte benutzte Stufe, Anzahl Schritte je Stufe)."""
    g = [row[:] for row in givens]
    LS = lines(n)
    sum_known = S != 0
    steps = {1: 0, 2: 0, 3: 0, 4: 0}
    used_max = 0
    while True:
        empties = [(r, c) for r in range(n) for c in range(n) if g[r][c] == 0]
        if not empties:
            return True, used_max, steps
        if not sum_known:
            full = [l for l in LS if all(g[r][c] for r, c in l)]
            if not full:
                return False, used_max, steps
            S = sum(g[r][c] for r, c in full[0])
            sum_known = True
        pool = [x for x in numbers if x not in {v for row in g for v in row if v}]
        placed = False
        for L in range(1, maxL + 1):
            cand = {e: set(pool) for e in empties}
            for l in LS:
                emp = [(r, c) for r, c in l if g[r][c] == 0]
                if not emp or len(emp) > L:
                    continue
                rest = S - sum(g[r][c] for r, c in l)
                for e in emp:
                    cand[e] = {v for v in cand[e]
                               if _subset_exists(pool, len(emp) - 1, rest - v, {v})}
            if any(not cs for cs in cand.values()):
                return False, used_max, steps
            move = None
            for e in empties:
                if len(cand[e]) == 1:
                    move = (e, next(iter(cand[e])))
                    break
            if move is None and L >= 2:   # versteckter Einzelner: Zahl passt nur noch an eine Stelle
                for v in pool:
                    spots = [e for e in empties if v in cand[e]]
                    if len(spots) == 1:
                        move = (spots[0], v)
                        break
            if move:
                (r, c), v = move
                g[r][c] = v
                steps[L] += 1
                used_max = max(used_max, L)
                placed = True
                break
        if not placed:
            return False, used_max, steps


# ---------------------------------------------------------------- Erzeugung
def _sym3(rng):
    sq = [row[:] for row in LO_SHU]
    for _ in range(rng.randrange(4)):
        sq = [list(row) for row in zip(*sq[::-1])]
    if rng.random() < 0.5:
        sq = [row[::-1] for row in sq]
    return sq


def _random_magic4(rng):
    """Zufälliges 4x4-Zauberquadrat mit 1..16 (Backtracking, zufällige Reihenfolge)."""
    n, S = 4, 34
    order = [(r, c) for r in range(4) for c in range(4)]
    g = [[0] * 4 for _ in range(4)]
    used = set()
    LS = lines(4)
    by_cell = {cell: [l for l in LS if cell in l] for cell in order}
    nums = list(range(1, 17))

    def ok(cell):
        for l in by_cell[cell]:
            vals = [g[r][c] for r, c in l]
            e = vals.count(0)
            s = sum(vals)
            if e == 0 and s != S:
                return False
            if e and not (s + e <= S <= s + 16 * e):
                return False
            if e == 1 and not (1 <= S - s <= 16 and S - s not in used):
                return False
        return True

    budget = [0]

    def rec(i):
        budget[0] += 1
        if budget[0] > 20000:
            return False
        if i == 16:
            return True
        r, c = order[i]
        vs = nums[:]
        rng.shuffle(vs)
        for v in vs:
            if v in used:
                continue
            g[r][c] = v
            used.add(v)
            if ok((r, c)) and rec(i + 1):
                return True
            used.discard(v)
            g[r][c] = 0
        return False

    while True:
        budget[0] = 0
        g = [[0] * 4 for _ in range(4)]
        used.clear()
        if rec(0):
            return g


def _reduce(rng, n, numbers, S, sol, maxL, keep=()):
    givens = [row[:] for row in sol]
    cells = [(r, c) for r in range(n) for c in range(n) if (r, c) not in keep]
    rng.shuffle(cells)
    for r, c in cells:
        v = givens[r][c]
        givens[r][c] = 0
        if not human_solve(n, numbers, S, givens, maxL)[0]:
            givens[r][c] = v
    return givens


def generate(level, rng):
    for _ in range(3000):
        if level in ("beispiel", "leicht"):
            sol = _sym3(rng)
            numbers = list(range(1, 10))
            S = 15
            givens = _reduce(rng, 3, numbers, S, sol, 1)
            ng = sum(1 for row in givens for v in row if v)
            ok, L, steps = human_solve(3, numbers, S, givens, 1)
            if level == "beispiel":
                # wieder auffüllen bis 5-6 Vorgaben
                target = rng.choice((5, 6))
                empt = [(r, c) for r in range(3) for c in range(3) if givens[r][c] == 0]
                rng.shuffle(empt)
                while ng < target:
                    r, c = empt.pop()
                    givens[r][c] = sol[r][c]
                    ng += 1
            elif not (3 <= ng <= 4):
                continue
            show_sum = S
        elif level == "mittel":
            a, b = rng.choice(NUMBER_SETS_3)
            base = _sym3(rng)
            sol = [[a * v + b for v in row] for row in base]
            numbers = sorted(v for row in sol for v in row)
            S = sum(sol[0])
            variant = getattr(rng, "_zq_mittel", 0)
            if variant % 2 == 0:
                givens = _reduce(rng, 3, numbers, S, sol, 2)
                ng = sum(1 for row in givens for v in row if v)
                ok, L, steps = human_solve(3, numbers, S, givens, 2)
                if not ok or L < 2 or ng != 3:
                    continue
                show_sum = S
            else:
                # Summe versteckt; eine volle Linie (nicht die Mitte) vorgegeben
                l = rng.choice([l for l in lines(3) if (1, 1) not in l])
                givens = _reduce(rng, 3, numbers, 0, sol, 2, keep=set(l))
                ng = sum(1 for row in givens for v in row if v)
                ok, L, steps = human_solve(3, numbers, 0, givens, 2)
                if not ok or ng > 4 or L < 2:
                    continue
                show_sum = 0
            rng._zq_mittel = variant + 1
        else:
            sol = _random_magic4(rng)
            numbers = list(range(1, 17))
            S = 34
            givens = _reduce(rng, 4, numbers, S, sol, 3)
            ok, L, steps = human_solve(4, numbers, S, givens, 3)
            ng = sum(1 for row in givens for v in row if v)
            # knifflig: Linien mit 3 leeren Feldern nötig oder nur 4-5 Vorgaben
            if not ok or L < 2 or (L < 3 and ng > 5):
                continue
            show_sum = S
        data = {"size": len(sol), "numbers": numbers, "sum": show_sum, "givens": givens}
        if count_solutions(data) != 1:
            continue
        return {"data": data, "solution": {"grid": sol, "sum": sum(sol[0])}}
    raise RuntimeError("kein Zauberquadrat gefunden")
