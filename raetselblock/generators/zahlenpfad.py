"""Zahlenpfad (Zip): eine Linie von 1 bis k, Zahlen der Reihe nach, jedes Feld genau einmal.
Optional Wände zwischen Feldern, durch die die Linie nicht darf.
"""
# level -> n, Ziel-Mindestzahl an Zahlen, max. Logikstufe, min. Logikstufe, Anzahl Wände
LEVELS = {
    "beispiel": dict(n=4, min_clues=5, tier=1, min_tier=1, walls=0),
    "leicht": dict(n=5, min_clues=8, tier=1, min_tier=1, walls=0),
    "mittel": dict(n=6, min_clues=6, tier=2, min_tier=1, walls=(0, 2)),
    "schwer": dict(n=7, min_clues=4, tier=3, min_tier=3, walls=(4, 7)),
}

DIRS = ((0, 1), (1, 0), (0, -1), (-1, 0))


def _edge(a, b):
    return (a, b) if a < b else (b, a)


def _graph(n, walls):
    wl = {_edge(tuple(w[0:2]), tuple(w[2:4])) for w in walls}
    adj = {}
    for r in range(n):
        for c in range(n):
            adj[(r, c)] = []
            for dr, dc in DIRS:
                y = (r + dr, c + dc)
                if 0 <= y[0] < n and 0 <= y[1] < n and _edge((r, c), y) not in wl:
                    adj[(r, c)].append(y)
    return adj


# ---------------------------------------------------------------- vollständiger Löser (DFS)
def count_solutions(data, limit=2):
    n = data["size"]
    adj0 = _graph(n, data.get("walls", []))
    N = n * n
    idx = {(r, c): r * n + c for r in range(n) for c in range(n)}
    adj = [[idx[y] for y in adj0[(r, c)]] for r in range(n) for c in range(n)]
    clue = [0] * N
    for r, c, v in data["clues"]:
        clue[idx[(r, c)]] = v
    k = max(clue)
    start = clue.index(1)
    end = clue.index(k)
    visited = [False] * N
    count = [0]

    def feasible(head, left):
        # Zusammenhang der freien Felder (+ Kopf)
        seen = {head}
        st = [head]
        while st:
            x = st.pop()
            for y in adj[x]:
                if not visited[y] and y not in seen:
                    seen.add(y)
                    st.append(y)
        if len(seen) - 1 != left:
            return False
        # Sackgassen: freies Feld (nicht Ende) braucht 2 verfügbare Nachbarn
        for x in range(N):
            if visited[x]:
                continue
            av = 0
            for y in adj[x]:
                if not visited[y] or y == head:
                    av += 1
            if av < (1 if x == end else 2):
                return False
        return True

    def rec(head, nxt, left):
        if count[0] >= limit:
            return
        if left == 0:
            if head == end:
                count[0] += 1
            return
        for y in adj[head]:
            if visited[y]:
                continue
            cy = clue[y]
            if cy and cy != nxt:
                continue
            if y == end and left > 1:
                continue
            visited[y] = True
            if feasible(y, left - 1):
                rec(y, nxt + 1 if cy else nxt, left - 1)
            visited[y] = False

    visited[start] = True
    rec(start, 2, N - 1)
    return count[0]


# ---------------------------------------------------------------- Logiklöser
class Contradiction(Exception):
    pass


def _propagate(n, adj, clue, on, off, tier):
    """Kantenbasierte Schlussregeln. Ändert on/off. Stufe 1: Grad (jedes Feld 2 Kanten, 1 und k
    nur eine), keine Kreise, Zahlenreihenfolge in Teilstücken. Stufe 2: Engstellen (Brücken)."""
    cells = list(adj)
    N = len(cells)
    k = max(clue.values())
    need = {x: (1 if clue.get(x) in (1, k) else 2) for x in cells}
    edges = {_edge(x, y) for x in cells for y in adj[x]}
    inc = {x: [_edge(x, y) for y in adj[x]] for x in cells}

    def fragments():
        nb = {x: [] for x in cells}
        for a, b in on:
            nb[a].append(b)
            nb[b].append(a)
        comp, frags = {}, []
        for x in cells:
            if x in comp:
                continue
            if len(nb[x]) == 2:
                continue  # Innenpunkt, wird über Endpunkt erreicht
            path = [x]
            prev, cur = None, x
            while True:
                nx = [y for y in nb[cur] if y != prev]
                if not nx:
                    break
                prev, cur = cur, nx[0]
                path.append(cur)
            fid = len(frags)
            for y in path:
                comp[y] = fid
            frags.append(path)
        if len(comp) < N:
            raise Contradiction  # Kreis
        return comp, frags

    def seq_ok(path):
        vals = [clue[x] for x in path if x in clue]
        if len(vals) <= 1:
            pass
        else:
            d = vals[1] - vals[0]
            if d not in (1, -1):
                return False
            for i in range(len(vals) - 1):
                if vals[i + 1] - vals[i] != d:
                    return False
        # 1 bzw. k darf nur am Ende eines Stücks liegen
        for i, x in enumerate(path):
            if clue.get(x) in (1, k) and 0 < i < len(path) - 1:
                return False
        if len(path) < N and clue.get(path[0]) in (1, k) and clue.get(path[-1]) in (1, k) and len(path) > 1:
            return False
        return True

    changed_any = False
    while True:
        changed = False
        for x in cells:
            pos = [e for e in inc[x] if e not in off]
            cnt_on = sum(1 for e in pos if e in on)
            if len(pos) < need[x] or cnt_on > need[x]:
                raise Contradiction
            if len(pos) == need[x] and cnt_on < need[x]:
                for e in pos:
                    on.add(e)
                changed = True
            elif cnt_on == need[x] and len(pos) > cnt_on:
                for e in pos:
                    if e not in on:
                        off.add(e)
                changed = True
        if changed:
            changed_any = True
            continue
        comp, frags = fragments()
        for p in frags:
            if not seq_ok(p):
                raise Contradiction
        if len(on) == N - 1:
            return changed_any
        for e in edges:
            if e in on or e in off:
                continue
            a, b = e
            if comp[a] == comp[b]:
                off.add(e)
                changed = True
                continue
            pa, pb = frags[comp[a]], frags[comp[b]]
            if pa[-1] != a:
                pa = pa[::-1]
            if pb[0] != b:
                pb = pb[::-1]
            if not seq_ok(pa + pb):
                off.add(e)
                changed = True
        if changed:
            changed_any = True
            continue
        if tier < 2:
            return changed_any
        # Brücken im Graphen der möglichen Kanten müssen benutzt werden
        g = {x: [] for x in cells}
        for e in edges:
            if e not in off:
                g[e[0]].append(e[1])
                g[e[1]].append(e[0])
        for br in _bridges(g):
            if br not in on:
                on.add(br)
                changed = True
        if not changed:
            # Zusammenhang
            seen = {cells[0]}
            st = [cells[0]]
            while st:
                x = st.pop()
                for y in g[x]:
                    if y not in seen:
                        seen.add(y)
                        st.append(y)
            if len(seen) < N:
                raise Contradiction
            return changed_any
        changed_any = True


def _bridges(g):
    disc, low, out = {}, {}, []
    t = [0]
    import sys
    sys.setrecursionlimit(10000)

    def dfs(u, pe):
        disc[u] = low[u] = t[0]
        t[0] += 1
        for v in g[u]:
            if v not in disc:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    out.append(_edge(u, v))
            elif v != pe:
                low[u] = min(low[u], disc[v])

    for u in g:
        if u not in disc:
            dfs(u, None)
    return out


def logic_solve(data, max_tier=3):
    """Gibt (gelöst?, höchste benutzte Stufe) zurück. Stufe 3: Probieren mit einem Schritt
    Vorausschau ("Wenn die Linie hier entlang ginge, wäre dort eine Sackgasse")."""
    n = data["size"]
    adj = _graph(n, data.get("walls", []))
    clue = {(r, c): v for r, c, v in data["clues"]}
    N = n * n
    on, off = set(), set()
    used = 0
    edges = sorted({_edge(x, y) for x in adj for y in adj[x]})
    try:
        while True:
            if _propagate(n, adj, clue, on, off, 1):
                used = max(used, 1)
            if len(on) == N - 1:
                return True, used
            if max_tier < 2:
                return False, used
            if _propagate(n, adj, clue, on, off, 2):
                used = max(used, 2)
                continue
            if len(on) == N - 1:
                return True, used
            if max_tier < 3:
                return False, used
            progress = False
            for e in edges:
                if e in on or e in off:
                    continue
                for setting in ("on", "off"):
                    on2, off2 = set(on), set(off)
                    (on2 if setting == "on" else off2).add(e)
                    try:
                        _propagate(n, adj, clue, on2, off2, 2)
                    except Contradiction:
                        (off if setting == "on" else on).add(e)
                        progress = True
                        break
                if progress:
                    break
            if not progress:
                return False, used
            used = 3
    except Contradiction:
        return False, used


# ---------------------------------------------------------------- Generator
def _hamilton_path(n, rng, moves=None):
    path = []
    for r in range(n):
        row = [(r, c) for c in range(n)]
        path += row if r % 2 == 0 else row[::-1]
    moves = moves or 20 * n * n
    for _ in range(moves):
        if rng.random() < 0.5:
            path.reverse()
        end = path[-1]
        nbs = [(end[0] + dr, end[1] + dc) for dr, dc in DIRS]
        nbs = [y for y in nbs if 0 <= y[0] < n and 0 <= y[1] < n and y != path[-2]]
        y = rng.choice(nbs)
        i = path.index(y)
        path[i + 1:] = path[i + 1:][::-1]
    return path


def _data(n, path, clue_idx, walls):
    clue_idx = sorted(clue_idx)
    clues = [[path[i][0], path[i][1], j + 1] for j, i in enumerate(clue_idx)]
    return {"size": n, "clues": sorted(clues), "walls": sorted(walls)}


def generate(level, rng):
    cfg = LEVELS[level]
    n = cfg["n"]
    N = n * n
    while True:
        path = _hamilton_path(n, rng)
        # zu gerade Pfade (lange Schlangenlinien) sind langweilig
        straight = sum(1 for i in range(1, N - 1)
                       if path[i - 1][0] - path[i][0] == path[i][0] - path[i + 1][0]
                       and path[i - 1][1] - path[i][1] == path[i][1] - path[i + 1][1])
        if straight > 0.55 * N:
            continue
        walls = []
        if cfg["walls"]:
            lo, hi = cfg["walls"]
            pe = {_edge(path[i], path[i + 1]) for i in range(N - 1)}
            cand = sorted({_edge((r, c), (r + dr, c + dc)) for r in range(n) for c in range(n)
                           for dr, dc in ((0, 1), (1, 0)) if r + dr < n and c + dc < n} - pe)
            rng.shuffle(cand)
            walls = [[a[0], a[1], b[0], b[1]] for a, b in cand[:rng.randint(lo, hi)]]
        # Start: alle Felder nummeriert, dann reduzieren
        clue_idx = set(range(N))
        # Zahlen entfernen, solange Logiklöser (bis zur Stufe) es schafft
        order = sorted(clue_idx - {0, N - 1})
        rng.shuffle(order)
        for i in order:
            if len(clue_idx) <= cfg["min_clues"]:
                break
            trial = clue_idx - {i}
            d = _data(n, path, trial, walls)
            if logic_solve(d, cfg["tier"])[0]:
                clue_idx = trial
        data = _data(n, path, clue_idx, walls)
        ok, used = logic_solve(data, cfg["tier"])
        if not ok or used < cfg["min_tier"]:
            continue
        if count_solutions(data) != 1:
            continue
        return {"data": data, "solution": {"path": [list(x) for x in path]}}
