"""Arukone / Numberlink generator with uniqueness check (all cells must be used)."""
import random
from pysat.solvers import Cadical153

DIRS = [(0, 1), (1, 0), (0, -1), (-1, 0)]


def neighbors(r, c, n):
    for dr, dc in DIRS:
        rr, cc = r + dr, c + dc
        if 0 <= rr < n and 0 <= cc < n:
            yield rr, cc


# ---------------------------------------------------------------- solver
def solve_all(n, ends, limit=2, max_iter=400):
    """ends: dict color -> ((r,c),(r,c)). Returns list of up to `limit` valid
    solutions (each a dict cell->color), cycle-free and covering all cells."""
    K = len(ends)
    cells = [(r, c) for r in range(n) for c in range(n)]
    vid = {}

    def v(key):
        if key not in vid:
            vid[key] = len(vid) + 1
        return vid[key]

    endpoint = {}
    for k, (a, b) in enumerate(ends.values()):
        endpoint[a] = k
        endpoint[b] = k
    colors = list(ends.keys())

    edges = []
    for r, c in cells:
        if c + 1 < n:
            edges.append(((r, c), (r, c + 1)))
        if r + 1 < n:
            edges.append(((r, c), (r + 1, c)))
    inc = {cell: [] for cell in cells}
    for e in edges:
        inc[e[0]].append(e)
        inc[e[1]].append(e)

    s = Cadical153()
    add = s.add_clause
    for cell in cells:
        xs = [v(("x", cell, k)) for k in range(K)]
        add(xs)
        for i in range(K):
            for j in range(i + 1, K):
                add([-xs[i], -xs[j]])
        if cell in endpoint:
            add([v(("x", cell, endpoint[cell]))])
        es = [v(("e", e)) for e in inc[cell]]
        if cell in endpoint:
            # exactly one
            add(es)
            for i in range(len(es)):
                for j in range(i + 1, len(es)):
                    add([-es[i], -es[j]])
        else:
            # exactly two: at least two, at most two
            for i in range(len(es)):
                add([es[j] for j in range(len(es)) if j != i])
            for i in range(len(es)):
                for j in range(i + 1, len(es)):
                    for k in range(j + 1, len(es)):
                        add([-es[i], -es[j], -es[k]])
    for e in edges:
        a, b = e
        for k in range(K):
            add([-v(("e", e)), -v(("x", a, k)), v(("x", b, k))])
            add([-v(("e", e)), -v(("x", b, k)), v(("x", a, k))])

    sols = []
    it = 0
    while it < max_iter and s.solve():
        it += 1
        model = set(l for l in s.get_model() if l > 0)
        on = [e for e in edges if v(("e", e)) in model]
        # find components; detect cycles (components without endpoints)
        adj = {cell: [] for cell in cells}
        for a, b in on:
            adj[a].append(b)
            adj[b].append(a)
        seen = set()
        cycles = []
        for cell in cells:
            if cell in seen:
                continue
            comp = []
            stack = [cell]
            seen.add(cell)
            while stack:
                x = stack.pop()
                comp.append(x)
                for y in adj[x]:
                    if y not in seen:
                        seen.add(y)
                        stack.append(y)
            if not any(x in endpoint for x in comp):
                cs = set(comp)
                cycles.append([e for e in on if e[0] in cs])
        if cycles:
            for cyc in cycles:
                add([-v(("e", e)) for e in cyc])
            continue
        sol = {}
        for cell in cells:
            for k in range(K):
                if v(("x", cell, k)) in model:
                    sol[cell] = colors[k]
        sols.append((sol, on))
        if len(sols) >= limit:
            break
        add([-v(("e", e)) for e in on])
    s.delete()
    return sols


# ---------------------------------------------------------------- generator
def random_cover(n, rng, min_len=3, max_len=None):
    max_len = max_len or n * 2
    free = {(r, c) for r in range(n) for c in range(n)}
    paths = []

    def free_deg(cell):
        return sum(1 for nb in neighbors(*cell, n) if nb in free)

    while free:
        # start at a cell with the fewest free neighbours (corners, dead ends)
        mind = min(free_deg(c) for c in free)
        start = rng.choice([c for c in free if free_deg(c) == mind])
        path = [start]
        free.discard(start)
        target = rng.randint(min_len, max_len)
        while len(path) < target:
            head = path[-1]
            opts = [nb for nb in neighbors(*head, n) if nb in free]
            # avoid paths touching themselves (makes shortcuts / ambiguity likely)
            opts = [o for o in opts
                    if not any(nb in path[:-1] for nb in neighbors(*o, n))]
            if not opts:
                break
            # Warnsdorff-ish with randomness
            opts.sort(key=lambda o: (free_deg(o) + rng.random() * 2.5))
            nxt = opts[0]
            path.append(nxt)
            free.discard(nxt)
        paths.append(path)

    # merge short paths into neighbours' endpoints
    changed = True
    while changed:
        changed = False
        for p in sorted(paths, key=len):
            if len(p) >= min_len:
                continue
            for q in paths:
                if q is p:
                    continue
                for pe, qe in [(p[0], q[0]), (p[0], q[-1]), (p[-1], q[0]), (p[-1], q[-1])]:
                    if qe in set(neighbors(*pe, n)):
                        pp = p if pe == p[-1] else p[::-1]
                        qq = q if qe == q[0] else q[::-1]
                        merged = pp + qq
                        paths.remove(p)
                        paths.remove(q)
                        paths.append(merged)
                        changed = True
                        break
                if changed:
                    break
            if changed:
                break
    if any(len(p) < min_len for p in paths):
        return None
    return paths


def generate(n, pairs_range, rng, tries=20000):
    lo, hi = pairs_range
    for _ in range(tries):
        paths = random_cover(n, rng, min_len=3, max_len=rng.randint(n, 2 * n + 2))
        if not paths or not (lo <= len(paths) <= hi):
            continue
        # reject pairs whose two letters sit right next to each other (too obvious)
        if any(p[-1] in set(neighbors(*p[0], n)) for p in paths):
            continue
        # reject straight-line paths, they are boring giveaways
        if any(len({r for r, _ in p}) == 1 or len({c for _, c in p}) == 1 for p in paths):
            if rng.random() < 0.7:
                continue
        rng.shuffle(paths)
        letters = "ABCDEFGHIJKLMNOP"
        ends = {letters[i]: (p[0], p[-1]) for i, p in enumerate(paths)}
        sols = solve_all(n, ends, limit=2)
        if len(sols) == 1:
            sol, on = sols[0]
            return ends, ordered_paths(ends, on)
    return None


def ordered_paths(ends, on_edges):
    """Turn the set of solution edges into ordered cell lists per letter."""
    adj = {}
    for a, b in on_edges:
        adj.setdefault(a, []).append(b)
        adj.setdefault(b, []).append(a)
    out = {}
    for letter, (start, _end) in ends.items():
        path = [start]
        prev = None
        cur = start
        while True:
            nxt = [x for x in adj.get(cur, []) if x != prev]
            if not nxt:
                break
            prev, cur = cur, nxt[0]
            path.append(cur)
        out[letter] = path
    return out


if __name__ == "__main__":
    # the puzzle from the photo (row, col) 0-indexed, 8x8
    photo = {
        "A": ((1, 1), (5, 3)), "H": ((1, 2), (1, 6)), "E": ((2, 2), (7, 7)),
        "D": ((2, 7), (5, 0)), "B": ((3, 2), (4, 3)), "C": ((3, 3), (7, 1)),
        "F": ((5, 5), (7, 6)), "G": ((6, 3), (7, 0)),
    }
    sols = solve_all(8, photo, limit=3)
    print("photo puzzle solutions:", len(sols))
    for sol, _ in sols:
        for r in range(8):
            print(" ".join(sol[(r, c)] for c in range(8)))
        print()
