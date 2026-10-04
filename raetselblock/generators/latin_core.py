"""Gemeinsamer Kern für Rätsel auf lateinischen Quadraten (Sudoku, Rechenkäfige, Größer-Kleiner).

- random_latin(): zufälliges lateinisches Quadrat (optional mit Sudoku-Kästen)
- LogicSolver: menschenähnlicher Löser mit Kandidaten-Elimination; meldet, welche
  Techniken nötig waren (für die Stufen-Einteilung). Rätsel, die er komplett löst,
  sind ohne Raten lösbar und damit automatisch eindeutig.
- count_solutions_sat(): unabhängiger vollständiger Löser (SAT) zum Zählen von Lösungen.

Zellen werden intern als Index i = r * n + c geführt, Kandidaten als Bitmaske
(Bit v-1 gesetzt = Wert v möglich).
"""
from collections import Counter
from itertools import product

from pysat.solvers import Cadical153

# Rechenzeichen (so stehen sie auch im JSON und im Druck)
ADD, SUB, MUL, DIV, GIVEN = "+", "−", "×", "÷", ""


def bits(mask):
    v = 1
    while mask:
        if mask & 1:
            yield v
        mask >>= 1
        v += 1


def popcount(m):
    return bin(m).count("1")


def lowest(m):
    return (m & -m).bit_length()


def highest(m):
    return m.bit_length()


# ---------------------------------------------------------------- Einheiten
def make_units(n, box=None):
    """Zeilen, Spalten und optional Kästen (box = (Höhe, Breite))."""
    units = [[r * n + c for c in range(n)] for r in range(n)]
    units += [[r * n + c for r in range(n)] for c in range(n)]
    if box:
        bh, bw = box
        for br in range(0, n, bh):
            for bc in range(0, n, bw):
                units.append([(br + i) * n + bc + j for i in range(bh) for j in range(bw)])
    return units


# ---------------------------------------------------------------- Zufallsquadrat
def random_latin(n, rng, box=None):
    """Zufälliges lateinisches Quadrat als Liste von Zeilen (Werte 1..n)."""
    units = make_units(n, box)
    peers = [set() for _ in range(n * n)]
    for u in units:
        for i in u:
            peers[i].update(u)
    for i in range(n * n):
        peers[i].discard(i)
    full = (1 << n) - 1
    grid = [0] * (n * n)

    def cand(i):
        m = full
        for p in peers[i]:
            if grid[p]:
                m &= ~(1 << (grid[p] - 1))
        return m

    def rec():
        best, bm, bc = None, None, 99
        for i in range(n * n):
            if not grid[i]:
                m = cand(i)
                c = popcount(m)
                if c < bc:
                    best, bm, bc = i, m, c
                    if c <= 1:
                        break
        if best is None:
            return True
        if bc == 0:
            return False
        vals = list(bits(bm))
        rng.shuffle(vals)
        for v in vals:
            grid[best] = v
            if rec():
                return True
        grid[best] = 0
        return False

    # erste Zeile zufällig permutieren -> schneller und abwechslungsreicher
    first = list(range(1, n + 1))
    rng.shuffle(first)
    grid[:n] = first
    if not rec():  # sollte nie passieren
        raise RuntimeError("kein lateinisches Quadrat gefunden")
    return [grid[r * n:(r + 1) * n] for r in range(n)]


# ---------------------------------------------------------------- Käfige
def cage_ok(op, target, vals):
    if op == ADD:
        return sum(vals) == target
    if op == MUL:
        p = 1
        for v in vals:
            p *= v
        return p == target
    if op == SUB:
        return abs(vals[0] - vals[1]) == target
    if op == DIV:
        a, b = max(vals), min(vals)
        return a % b == 0 and a // b == target
    if op == GIVEN:
        return vals[0] == target
    raise ValueError(op)


def cage_tuples(n, cells, op, target):
    """Alle Wertetupel für die Käfigzellen (cells = Liste von (r, c)), die die Rechnung
    erfüllen und in gleicher Zeile/Spalte keine Zahl doppelt haben."""
    k = len(cells)
    clash = [(i, j) for i in range(k) for j in range(i + 1, k)
             if cells[i][0] == cells[j][0] or cells[i][1] == cells[j][1]]
    out = []
    for t in product(range(1, n + 1), repeat=k):
        if any(t[i] == t[j] for i, j in clash):
            continue
        if cage_ok(op, target, t):
            out.append(t)
    return out


# ---------------------------------------------------------------- logischer Löser
_STRUCT = {}


def _structure(n, box):
    key = (n, tuple(box) if box else None)
    if key not in _STRUCT:
        units = make_units(n, box)
        peers = [set() for _ in range(n * n)]
        for u in units:
            for i in u:
                peers[i].update(u)
        for i in range(n * n):
            peers[i].discard(i)
        _STRUCT[key] = (units, [frozenset(p) for p in peers])
    return _STRUCT[key]


TECH_ORDER = ("single", "cage", "ineq", "hidden", "pairs", "pointing", "cageline")


class LogicSolver:
    """Kandidaten-Elimination ohne Raten.

    Techniken (immer die einfachste zuerst, nach jedem Fortschritt wieder von vorn):
      single   – feste Zahl aus Zeile/Spalte/Kasten streichen (naked single)
      cage     – Käfig: nur Zahlen behalten, die in eine passende Rechnung passen
      ineq     – Größer/Kleiner: Schranken weitergeben
      hidden   – Zahl hat in einer Zeile/Spalte/Kasten nur noch einen Platz (hidden single)
      pairs    – zwei Zellen einer Einheit mit denselben zwei Kandidaten (naked pair)
      pointing – Sudoku: Zahl im Kasten nur in einer Zeile/Spalte (und umgekehrt)
      cageline – Käfig erzwingt Zahl in einer Zeile/Spalte -> dort sonst streichen
    """

    def __init__(self, n, box=None, givens=None, cages=(), lts=()):
        self.n = n
        self.N = n * n
        self.full = (1 << n) - 1
        self.units, self.peers = _structure(n, box)
        self.line_units = self.units[:2 * n]
        self.box_units = self.units[2 * n:]
        self.givens = givens or {}  # idx -> Wert
        # cages: Liste (zellindizes, tupel)
        self.cages = []
        for cells, op, target in cages:
            idx = [r * n + c for r, c in cells]
            self.cages.append((idx, cage_tuples(n, cells, op, target)))
        self.lts = list(lts)  # (i, j): Wert(i) < Wert(j)

    # -- Techniken; jede gibt True zurück, wenn sie etwas gestrichen hat
    def t_single(self, cand):
        changed = False
        for i in range(self.N):
            m = cand[i]
            if m and not (m & (m - 1)):
                for p in self.peers[i]:
                    if cand[p] & m:
                        cand[p] &= ~m
                        changed = True
        return changed

    def t_cage(self, cand):
        changed = False
        for idx, tuples in self.cages:
            allowed = [0] * len(idx)
            alive = []
            for t in tuples:
                if all(cand[i] >> (v - 1) & 1 for i, v in zip(idx, t)):
                    alive.append(t)
                    for k, v in enumerate(t):
                        allowed[k] |= 1 << (v - 1)
            for k, i in enumerate(idx):
                if cand[i] & ~allowed[k]:
                    cand[i] &= allowed[k]
                    changed = True
        return changed

    def t_ineq(self, cand):
        changed = False
        for a, b in self.lts:
            if not cand[a] or not cand[b]:
                continue
            hb = highest(cand[b])          # a < max(b)
            na = cand[a] & ((1 << (hb - 1)) - 1)
            la = lowest(cand[a])           # b > min(a)
            nb = cand[b] & ~((1 << la) - 1)
            if na != cand[a] or nb != cand[b]:
                cand[a], cand[b] = na, nb
                changed = True
        return changed

    def t_hidden(self, cand):
        changed = False
        for u in self.units:
            for v in range(self.n):
                bit = 1 << v
                where = [i for i in u if cand[i] & bit]
                if len(where) == 1 and cand[where[0]] != bit:
                    cand[where[0]] = bit
                    changed = True
        return changed

    def t_pairs(self, cand):
        changed = False
        for u in self.units:
            seen = {}
            for i in u:
                if popcount(cand[i]) == 2:
                    seen.setdefault(cand[i], []).append(i)
            for m, cells in seen.items():
                if len(cells) == 2:
                    for i in u:
                        if i not in cells and cand[i] & m:
                            cand[i] &= ~m
                            changed = True
        return changed

    def t_pointing(self, cand):
        changed = False
        n = self.n
        for b in self.box_units:
            bs = set(b)
            for v in range(n):
                bit = 1 << v
                where = [i for i in b if cand[i] & bit]
                if len(where) < 2:
                    continue
                for key, off in ((lambda i: i // n, 0), (lambda i: i % n, n)):
                    if len({key(i) for i in where}) == 1:
                        line = self.line_units[off + key(where[0])]
                        for i in line:
                            if i not in bs and cand[i] & bit:
                                cand[i] &= ~bit
                                changed = True
        # box/line reduction
        for line in self.line_units:
            for v in range(n):
                bit = 1 << v
                where = [i for i in line if cand[i] & bit]
                if len(where) < 2:
                    continue
                for b in self.box_units:
                    if all(i in b for i in where):
                        for i in b:
                            if i not in line and cand[i] & bit:
                                cand[i] &= ~bit
                                changed = True
        return changed

    def t_cageline(self, cand):
        changed = False
        n = self.n
        for idx, tuples in self.cages:
            alive = [t for t in tuples if all(cand[i] >> (v - 1) & 1 for i, v in zip(idx, t))]
            if not alive:
                continue
            for key, unit_of in ((lambda i: i // n, lambda k: [k * n + c for c in range(n)]),
                                 (lambda i: i % n, lambda k: [r * n + k for r in range(n)])):
                lines = {key(i) for i in idx}
                for k in lines:
                    pos = [j for j, i in enumerate(idx) if key(i) == k]
                    req = self.full
                    for t in alive:
                        m = 0
                        for j in pos:
                            m |= 1 << (t[j] - 1)
                        req &= m
                    if not req:
                        continue
                    inside = set(idx)
                    for i in unit_of(k):
                        if i not in inside and cand[i] & req:
                            cand[i] &= ~req
                            changed = True
        return changed

    def solve(self, techniques=TECH_ORDER):
        """Gibt (gelöst?, Gitter oder None, Counter der benutzten Techniken) zurück."""
        cand = [self.full] * self.N
        for i, v in self.givens.items():
            cand[i] = 1 << (v - 1)
        order = [t for t in TECH_ORDER if t in techniques]
        funcs = [getattr(self, "t_" + t) for t in order]
        stats = Counter()
        while True:
            if any(m == 0 for m in cand):
                return False, None, stats
            if all(not (m & (m - 1)) for m in cand):
                grid = [lowest(m) for m in cand]
                # Endkontrolle (Einheiten vollständig, Käfige/Zeichen erfüllt)
                if not self._valid(grid):
                    return False, None, stats
                return True, [grid[r * self.n:(r + 1) * self.n] for r in range(self.n)], stats
            for name, f in zip(order, funcs):
                if f(cand):
                    stats[name] += 1
                    break
            else:
                return False, None, stats

    def _valid(self, grid):
        for u in self.units:
            if len({grid[i] for i in u}) != self.n:
                return False
        for idx, tuples in self.cages:
            if tuple(grid[i] for i in idx) not in tuples:
                return False
        return all(grid[a] < grid[b] for a, b in self.lts)


# ---------------------------------------------------------------- SAT-Zähler
def count_solutions_sat(n, box=None, givens=None, cages=(), lts=(), limit=2):
    """Unabhängiger vollständiger Löser. givens: dict (r, c) -> v; cages: (cells, op, target);
    lts: ((r1, c1), (r2, c2)) mit Wert1 < Wert2."""
    def x(r, c, v):
        return (r * n + c) * n + v  # v in 1..n -> 1..n^3

    nxt = [n ** 3]

    def new():
        nxt[0] += 1
        return nxt[0]

    s = Cadical153()

    def exactly_one(lits):
        s.add_clause(lits)
        for i in range(len(lits)):
            for j in range(i + 1, len(lits)):
                s.add_clause([-lits[i], -lits[j]])

    for r in range(n):
        for c in range(n):
            exactly_one([x(r, c, v) for v in range(1, n + 1)])
    for u in make_units(n, box):
        for v in range(1, n + 1):
            exactly_one([x(i // n, i % n, v) for i in u])
    for (r, c), v in (givens or {}).items():
        s.add_clause([x(r, c, v)])
    for (a, b) in lts:
        for va in range(1, n + 1):
            for vb in range(1, va + 1):
                s.add_clause([-x(*a, va), -x(*b, vb)])
    for cells, op, target in cages:
        sel = []
        for t in cage_tuples(n, cells, op, target):
            y = new()
            sel.append(y)
            for (r, c), v in zip(cells, t):
                s.add_clause([-y, x(r, c, v)])
        s.add_clause(sel)  # leer -> unerfüllbar

    count = 0
    while count < limit and s.solve():
        model = s.get_model()
        count += 1
        s.add_clause([-l for l in model if 0 < l <= n ** 3])
    s.delete()
    return count
