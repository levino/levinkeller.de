"""Kreuzrechnen: 3x3-Zahlenfelder mit Rechenzeichen dazwischen, Ziffern 1-9 je einmal.

Gerechnet wird immer der Reihe nach (links -> rechts, oben -> unten), nicht Punkt vor Strich.
Der Generator erzeugt nur Rätsel, deren Zwischenergebnisse positiv, ganzzahlig und <= 100 sind.
Die Lösungszählung ist absichtlich großzügiger (exakte Bruchrechnung, auch negative
Zwischenwerte): Eindeutig dort heißt eindeutig für jede vernünftige Lesart.

data = {
  "grid":   3x3, 0 = leer, sonst vorgegebene Ziffer,
  "hops":   3 Zeilen x 2 Zeichen  (zwischen Spalte 0/1 und 1/2),
  "vops":   3 Spalten x 2 Zeichen (zwischen Zeile 0/1 und 1/2),
  "rows":   3 Zeilenergebnisse, "cols": 3 Spaltenergebnisse
}   Zeichen: "+", "-", "*", "/"
"""
import itertools
from fractions import Fraction

DIGITS = range(1, 10)
TRIPLES = list(itertools.permutations(DIGITS, 3))

LEVELS = {
    #            ops           givens   cap  extra
    "beispiel": ("+-",         (5,),    30),
    "leicht":   ("+-",         (3,),    40),
    "mittel":   ("+-*",        (2, 3),  100),
    "schwer":   ("+-*/",       (1, 2),  100),
}


def _apply(x, op, y):
    if op == "+":
        return x + y
    if op == "-":
        return x - y
    if op == "*":
        return x * y
    return Fraction(x) / y


_TABLE = {}


def _table(o1, o2):
    """{ergebnis: [tripel]} für alle Tripel verschiedener Ziffern (exakt, großzügig)."""
    key = o1 + o2
    if key not in _TABLE:
        d = {}
        for t in TRIPLES:
            v = _apply(_apply(t[0], o1, t[1]), o2, t[2])
            d.setdefault(v, []).append(t)
        _TABLE[key] = d
    return _TABLE[key]


def _lines(data):
    """6 Gleichungen: (Zellen, Tripelliste)."""
    out = []
    for r in range(3):
        o1, o2 = data["hops"][r]
        out.append(([(r, 0), (r, 1), (r, 2)], _table(o1, o2).get(data["rows"][r], [])))
    for c in range(3):
        o1, o2 = data["vops"][c]
        out.append(([(0, c), (1, c), (2, c)], _table(o1, o2).get(data["cols"][c], [])))
    return out


# ---------------------------------------------------------------- Zählen (Brute force mit Pruning)
def _solutions(data, limit):
    g = data["grid"]
    rowc = []
    for r in range(3):
        o1, o2 = data["hops"][r]
        cand = [t for t in _table(o1, o2).get(data["rows"][r], [])
                if all(g[r][c] in (0, t[c]) for c in range(3))]
        rowc.append(cand)
    colsets = []
    for c in range(3):
        o1, o2 = data["vops"][c]
        colsets.append(set(_table(o1, o2).get(data["cols"][c], [])))
    sols = []
    for a in rowc[0]:
        sa = set(a)
        for b in rowc[1]:
            if sa & set(b):
                continue
            sab = sa | set(b)
            for cc in rowc[2]:
                if sab & set(cc):
                    continue
                if all((a[i], b[i], cc[i]) in colsets[i] for i in range(3)):
                    sols.append([list(a), list(b), list(cc)])
                    if len(sols) >= limit:
                        return sols
    return sols


def count_solutions(data, limit=2):
    return len(_solutions(data, limit))


# ---------------------------------------------------------------- Logik-Löser
def logic_solve(data, max_unknown=3):
    """Gleichungsweise Kandidaten-Elimination + 'jede Ziffer genau einmal'.
    max_unknown: nur Gleichungen mit höchstens so vielen offenen Feldern werden benutzt
    (2 = 'einfach': man probiert höchstens Paare). Gibt (gelöst?, Schritte) zurück."""
    dom = {(r, c): ({data["grid"][r][c]} if data["grid"][r][c] else set(DIGITS))
           for r in range(3) for c in range(3)}
    lines = _lines(data)
    steps = 0
    changed = True
    while changed:
        changed = False
        steps += 1
        for cells, triples in lines:
            if sum(len(dom[x]) > 1 for x in cells) > max_unknown:
                continue
            ok = [t for t in triples if all(t[i] in dom[cells[i]] for i in range(3))]
            for i, x in enumerate(cells):
                nd = {t[i] for t in ok}
                if nd != dom[x]:
                    dom[x] = nd
                    changed = True
        # jede Ziffer genau einmal
        for x in dom:
            if len(dom[x]) == 1:
                v = next(iter(dom[x]))
                for y in dom:
                    if y != x and v in dom[y]:
                        dom[y].discard(v)
                        changed = True
        for v in DIGITS:
            where = [x for x in dom if v in dom[x]]
            if len(where) == 1 and len(dom[where[0]]) > 1:
                dom[where[0]] = {v}
                changed = True
        if any(len(d) == 0 for d in dom.values()):
            return False, steps
    return all(len(d) == 1 for d in dom.values()), steps


def _has_entry(data, max_cands=3):
    """Einstieg für schwer: eine ×/÷-Rechnung, zu der (mit den Vorgaben) höchstens
    max_cands Zahlentripel passen."""
    g = data["grid"]
    ops = [data["hops"][r] for r in range(3)] + [data["vops"][c] for c in range(3)]
    for (cells, triples), o in zip(_lines(data), ops):
        if not any(x in "*/" for x in o):
            continue
        ok = [t for t in triples if all(g[r][c] in (0, t[i]) for i, (r, c) in enumerate(cells))]
        if len(ok) <= max_cands:
            return True
    return False


# ---------------------------------------------------------------- Erzeugen
def _valid(x, op, y, cap):
    if op == "/":
        if x % y:
            return None
        v = x // y
    else:
        v = _apply(x, op, y)
    return v if 0 < v <= cap else None


def _ops_for(t, allowed, cap, rng, weights):
    opts = []
    for o1 in allowed:
        v1 = _valid(t[0], o1, t[1], cap)
        if v1 is None:
            continue
        for o2 in allowed:
            v2 = _valid(v1, o2, t[2], cap)
            if v2 is not None:
                opts.append(((o1, o2), v2))
    if not opts:
        return None
    w = [weights[a] * weights[b] for (a, b), _ in opts]
    return rng.choices(opts, weights=w)[0]


def _ops_ok(level, ops):
    flat = [o for pair in ops for o in pair]
    n_mul, n_div = flat.count("*"), flat.count("/")
    n_minus = flat.count("-")
    if level in ("beispiel", "leicht"):
        return 3 <= n_minus <= 7
    if level == "mittel":
        return 3 <= n_mul <= 5 and n_minus >= 2
    return n_mul >= 2 and n_div >= 2 and flat.count("+") + n_minus >= 4


def generate(level, rng):
    allowed, givens_opts, cap = LEVELS[level]
    weights = {"+": 1.0, "-": 1.3, "*": 1.4, "/": 6.0}
    while True:
        digits = list(DIGITS)
        rng.shuffle(digits)
        sol = [digits[0:3], digits[3:6], digits[6:9]]
        hops, rows, vops, cols = [], [], [], []
        bad = False
        for r in range(3):
            res = _ops_for(sol[r], allowed, cap, rng, weights)
            if res is None:
                bad = True
                break
            hops.append(list(res[0]))
            rows.append(res[1])
        if bad:
            continue
        for c in range(3):
            res = _ops_for([sol[0][c], sol[1][c], sol[2][c]], allowed, cap, rng, weights)
            if res is None:
                bad = True
                break
            vops.append(list(res[0]))
            cols.append(res[1])
        if bad or not _ops_ok(level, hops + vops):
            continue
        base = {"hops": hops, "vops": vops, "rows": rows, "cols": cols}
        cells = [(r, c) for r in range(3) for c in range(3)]
        for k in givens_opts:
            subsets = list(itertools.combinations(cells, k))
            rng.shuffle(subsets)
            for sub in subsets[:60]:
                grid = [[0] * 3 for _ in range(3)]
                for (r, c) in sub:
                    grid[r][c] = sol[r][c]
                data = dict(base, grid=grid)
                if count_solutions(data) != 1:
                    continue
                # beispiel: nur Zeilen mit 1 offenem Feld (reines Ausrechnen)
                # leicht/mittel: höchstens 2 offene Felder pro benutzter Rechnung
                # schwer: braucht mindestens einmal eine Rechnung mit 3 offenen Feldern
                need = {"beispiel": 1, "leicht": 2, "mittel": 2, "schwer": 3}[level]
                if not logic_solve(data, max_unknown=need)[0]:
                    continue
                if level == "schwer":
                    if logic_solve(data, max_unknown=2)[0]:
                        continue
                    if not _has_entry(data):
                        continue
                return {"data": {"grid": grid, "hops": hops, "vops": vops, "rows": rows, "cols": cols},
                        "solution": {"grid": sol}}
