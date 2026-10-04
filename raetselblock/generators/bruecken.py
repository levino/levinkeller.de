"""Brücken (Hashi): Inseln mit Zahlen durch waagerechte/senkrechte Brücken verbinden.

data:     {"w": W, "h": H, "islands": [[r, c, n], ...]}
solution: {"bridges": [[i, j, k], ...]}   # Inselindizes i<j, k = 1 oder 2
"""
from pysat.card import CardEnc, EncType
from pysat.formula import IDPool
from pysat.solvers import Cadical153

# (W, H, Inseln min, max, Anteil Doppelbrücken, Extra-Kanten-Wahrscheinlichkeit, Logikstufe)
LEVELS = {
    "beispiel": (5, 5, 5, 6, 0.35, 0.15, 1),
    "leicht": (7, 7, 9, 11, 0.35, 0.20, 1),
    "mittel": (9, 9, 13, 15, 0.40, 0.30, 2),
    "schwer": (10, 10, 19, 21, 0.40, 0.35, 2),
}
DIRS = [(0, 1), (1, 0), (0, -1), (-1, 0)]


# ---------------------------------------------------------------- Geometrie
def potential_edges(islands):
    """Kanten zwischen in einer Zeile/Spalte direkt benachbarten Inseln.
    islands: Liste (r, c). Rückgabe: Liste (i, j) mit i<j."""
    pos = {(r, c): i for i, (r, c) in enumerate(islands)}
    edges = []
    for i, (r, c) in enumerate(islands):
        for dr, dc in ((0, 1), (1, 0)):
            rr, cc = r + dr, c + dc
            while 0 <= rr < 64 and 0 <= cc < 64:
                if (rr, cc) in pos:
                    j = pos[(rr, cc)]
                    edges.append((min(i, j), max(i, j)))
                    break
                rr += dr
                cc += dc
                if rr > 64 or cc > 64:
                    break
    return sorted(set(edges))


def crossings(islands, edges):
    def seg(e):
        (r1, c1), (r2, c2) = islands[e[0]], islands[e[1]]
        if r1 == r2:
            return ("h", r1, min(c1, c2), max(c1, c2))
        return ("v", c1, min(r1, r2), max(r1, r2))

    segs = [seg(e) for e in edges]
    cross = {k: [] for k in range(len(edges))}
    for a in range(len(edges)):
        for b in range(a + 1, len(edges)):
            sa, sb = segs[a], segs[b]
            if sa[0] == sb[0]:
                continue
            h, v = (sa, sb) if sa[0] == "h" else (sb, sa)
            # h: row, c1, c2 ; v: col, r1, r2
            if v[2] < h[1] < v[3] and h[2] < v[1] < h[3]:
                cross[a].append(b)
                cross[b].append(a)
    return cross


# ---------------------------------------------------------------- SAT-Zähler
def solve_all(islands, nums, limit=2, max_iter=2000):
    """Alle (bis limit) zusammenhängenden Lösungen. Rückgabe: Liste {edge_idx: k}."""
    N = len(islands)
    edges = potential_edges(islands)
    cross = crossings(islands, edges)
    pool = IDPool()
    b1 = [pool.id(("b1", k)) for k in range(len(edges))]
    b2 = [pool.id(("b2", k)) for k in range(len(edges))]
    s = Cadical153()
    for k in range(len(edges)):
        s.add_clause([-b2[k], b1[k]])
        for f in cross[k]:
            if f > k:
                s.add_clause([-b1[k], -b1[f]])
    inc = {i: [] for i in range(N)}
    for k, (i, j) in enumerate(edges):
        inc[i].append(k)
        inc[j].append(k)
    for i in range(N):
        lits = [b1[k] for k in inc[i]] + [b2[k] for k in inc[i]]
        if not lits:
            if nums[i] != 0:
                s.delete()
                return []
            continue
        if nums[i] > len(lits):
            s.delete()
            return []
        cnf = CardEnc.equals(lits=lits, bound=nums[i], vpool=pool, encoding=EncType.seqcounter)
        for cl in cnf.clauses:
            s.add_clause(cl)
    sols = []
    it = 0
    while it < max_iter and s.solve():
        it += 1
        model = set(l for l in s.get_model() if l > 0)
        val = {k: (1 if b1[k] in model else 0) + (1 if b2[k] in model else 0) for k in range(len(edges))}
        # Zusammenhang prüfen
        parent = list(range(N))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for k, (i, j) in enumerate(edges):
            if val[k]:
                parent[find(i)] = find(j)
        comps = {}
        for i in range(N):
            comps.setdefault(find(i), set()).add(i)
        if len(comps) > 1:
            # jede Komponente braucht eine Brücke nach außen
            for comp in comps.values():
                cut = [b1[k] for k, (i, j) in enumerate(edges) if (i in comp) != (j in comp)]
                s.add_clause(cut)
            continue
        sols.append({edges[k]: v for k, v in val.items() if v})
        if len(sols) >= limit:
            break
        s.add_clause([-b1[k] if val[k] else b1[k] for k in range(len(edges))]
                     + [-b2[k] if val[k] == 2 else b2[k] for k in range(len(edges))])
    s.delete()
    return sols


# ---------------------------------------------------------------- Logiklöser
def logic_solve(islands, nums, level=2):
    """Menschliche Regeln ohne Raten.
    Stufe 1: Zählen (Restbedarf vs. Möglichkeiten) + Kreuzungsverbot.
    Stufe 2: zusätzlich Zusammenhang: keine abgeschlossene Gruppe bilden,
             und eine Gruppe mit nur einem Ausgang muss ihn benutzen.
    Rückgabe: (gelöst?, benutzte Stufe-2-Schritte, Lösung {edge: k})"""
    N = len(islands)
    edges = potential_edges(islands)
    cross = crossings(islands, edges)
    E = len(edges)
    inc = {i: [] for i in range(N)}
    for k, (i, j) in enumerate(edges):
        inc[i].append(k)
        inc[j].append(k)
    lo = [0] * E
    hi = [min(2, nums[i], nums[j]) for (i, j) in edges]
    used2 = 0

    def basic():
        changed = True
        any_change = False
        while changed:
            changed = False
            for k in range(E):
                if lo[k] >= 1:
                    for f in cross[k]:
                        if lo[f] >= 1:
                            return None
                        if hi[f] > 0:
                            hi[f] = 0
                            changed = True
            for i in range(N):
                slo = sum(lo[k] for k in inc[i])
                shi = sum(hi[k] for k in inc[i])
                n = nums[i]
                if n < slo or n > shi:
                    return None
                for k in inc[i]:
                    nl = max(lo[k], n - (shi - hi[k]))
                    nh = min(hi[k], n - (slo - lo[k]))
                    if nl > nh:
                        return None
                    if nl != lo[k] or nh != hi[k]:
                        lo[k], hi[k] = nl, nh
                        changed = True
                        slo = sum(lo[x] for x in inc[i])
                        shi = sum(hi[x] for x in inc[i])
            any_change |= changed
        return any_change

    def components():
        parent = list(range(N))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for k, (i, j) in enumerate(edges):
            if lo[k] >= 1:
                parent[find(i)] = find(j)
        return find

    def connect_rules():
        find = components()
        comp_of = [find(i) for i in range(N)]
        rem = {}
        size = {}
        for i in range(N):
            r = comp_of[i]
            rem[r] = rem.get(r, 0) + nums[i] - sum(lo[k] for k in inc[i])
            size[r] = size.get(r, 0) + 1
        changed = False
        # (a) keine abgeschlossene Teilgruppe erzeugen
        for k, (i, j) in enumerate(edges):
            if hi[k] <= lo[k]:
                continue
            ci, cj = comp_of[i], comp_of[j]
            U_rem = rem[ci] + (rem[cj] if cj != ci else 0)
            U_size = size[ci] + (size[cj] if cj != ci else 0)
            if U_size >= N:
                continue
            for v in range(lo[k] + 1, hi[k] + 1):
                if U_rem - 2 * (v - lo[k]) == 0:
                    hi[k] = v - 1
                    changed = True
                    break
        if changed:
            return True
        # (b) Gruppe mit genau einem möglichen Ausgang
        if len(size) > 1:
            for r in size:
                outs = [k for k, (i, j) in enumerate(edges)
                        if hi[k] > 0 and (comp_of[i] == r) != (comp_of[j] == r)]
                if len(outs) == 1 and lo[outs[0]] == 0:
                    lo[outs[0]] = 1
                    return True
                if not outs:
                    return None
        return False

    while True:
        res = basic()
        if res is None:
            return False, used2, None
        if all(lo[k] == hi[k] for k in range(E)):
            break
        if level < 2:
            return False, used2, None
        res = connect_rules()
        if res is None:
            return False, used2, None
        if not res:
            return False, used2, None
        used2 += 1
    sol = {edges[k]: lo[k] for k in range(E) if lo[k]}
    # Zusammenhang der Endlösung prüfen
    adj = {i: set() for i in range(N)}
    for (i, j) in sol:
        adj[i].add(j)
        adj[j].add(i)
    seen, stack = {0}, [0]
    while stack:
        x = stack.pop()
        for y in adj[x]:
            if y not in seen:
                seen.add(y)
                stack.append(y)
    if len(seen) != N:
        return False, used2, None
    return True, used2, sol


# ---------------------------------------------------------------- Generator
def build_graph(W, H, N, p2, pextra, rng):
    islands = []
    isl_set = set()
    bridge_cells = set()
    bridges = {}

    def cells_between(a, b):
        (r1, c1), (r2, c2) = a, b
        if r1 == r2:
            return [(r1, c) for c in range(min(c1, c2) + 1, max(c1, c2))]
        return [(r, c1) for r in range(min(r1, r2) + 1, max(r1, r2))]

    def add_island(p):
        islands.append(p)
        isl_set.add(p)

    def add_bridge(i, j, k):
        bridges[(min(i, j), max(i, j))] = k
        for x in cells_between(islands[i], islands[j]):
            bridge_cells.add(x)

    start = (rng.randrange(H), rng.randrange(W))
    add_island(start)
    fails = 0
    while len(islands) < N and fails < 400:
        a = rng.randrange(len(islands))
        r, c = islands[a]
        dr, dc = rng.choice(DIRS)
        maxd = max(W, H)
        d = rng.randint(2, max(2, min(maxd - 1, 5)))
        t = (r + dr * d, c + dc * d)
        ok = 0 <= t[0] < H and 0 <= t[1] < W and t not in isl_set and t not in bridge_cells
        if ok:
            # keine Insel direkt daneben (waagerecht/senkrecht)
            for ddr, ddc in DIRS:
                if (t[0] + ddr, t[1] + ddc) in isl_set:
                    ok = False
                    break
        if ok:
            for x in cells_between((r, c), t):
                if x in isl_set or x in bridge_cells:
                    ok = False
                    break
        if not ok:
            fails += 1
            continue
        add_island(t)
        add_bridge(a, len(islands) - 1, 2 if rng.random() < p2 else 1)
    if len(islands) < N:
        return None
    # Extra-Brücken (Kreise) hinzufügen
    edges = potential_edges(islands)
    rng.shuffle(edges)
    for (i, j) in edges:
        if (i, j) in bridges:
            continue
        if rng.random() >= pextra:
            continue
        cb = cells_between(islands[i], islands[j])
        if any(x in bridge_cells for x in cb):
            continue
        add_bridge(i, j, 2 if rng.random() < p2 else 1)
    return islands, bridges


def generate(level, rng):
    W, H, nmin, nmax, p2, pextra, lv = LEVELS[level]
    for attempt in range(20000):
        N = rng.randint(nmin, nmax)
        g = build_graph(W, H, N, p2, pextra, rng)
        if not g:
            continue
        islands, bridges = g
        rows = {r for r, _ in islands}
        cols = {c for _, c in islands}
        if min(rows) != 0 or max(rows) != H - 1 or min(cols) != 0 or max(cols) != W - 1:
            continue
        nums = [0] * len(islands)
        for (i, j), k in bridges.items():
            nums[i] += k
            nums[j] += k
        if max(nums) > 8:
            continue
        if level != "beispiel" and nums.count(1) > len(nums) // 3:
            continue
        ok, used2, sol = logic_solve(islands, nums, level=lv)
        if not ok:
            continue
        if level == "schwer" and used2 < 3:
            continue
        if level == "mittel" and used2 < 1 and rng.random() < 0.7:
            continue
        if len(solve_all(islands, nums, limit=2)) != 1:
            continue
        # Inseln sortieren (lesefreundlich, deterministisch)
        order = sorted(range(len(islands)), key=lambda i: islands[i])
        newidx = {o: n for n, o in enumerate(order)}
        isl_out = [[islands[o][0], islands[o][1], nums[o]] for o in order]
        br_out = sorted([sorted([newidx[i], newidx[j]]) + [k] for (i, j), k in sol.items()])
        return {
            "data": {"w": W, "h": H, "islands": isl_out},
            "solution": {"bridges": br_out},
        }
    raise RuntimeError("bruecken: keine Instanz gefunden")


def count_solutions(data, limit=2):
    islands = [(r, c) for r, c, _ in data["islands"]]
    nums = [n for _, _, n in data["islands"]]
    return len(solve_all(islands, nums, limit=limit))
