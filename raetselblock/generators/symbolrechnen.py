"""Symbolrätsel: jede Form steht für eine Zahl.

data = {
  "shapes":    ["dreieck", "kreis", ...],                 # Reihenfolge der Eintrage-Reihe unten
  "equations": [{"terms": ["dreieck", "dreieck"], "ops": ["+"], "result": 10}, ...],
  "question":  {"terms": [...], "ops": [...]},
}
ops je Zeile: nur "+"/"-" oder nur "*"/"/" (keine Punkt-vor-Strich-Fallen), gerechnet von links nach rechts.
solution = {"values": {"dreieck": 5, ...}, "answer": 17}

Stufen:
  beispiel 2 Formen, nur +, Werte 1-9
  leicht   3 Formen, + und -, Werte 1-10, Kette (jede Zeile bringt genau eine neue Form)
  mittel   3-4 Formen, mit x und :, Werte 2-12, Zeilen gemischt angeordnet
  schwer   4 Formen, Werte 2-20, mindestens ein Paar Gleichungen muss kombiniert werden
           (z. B. A+B=10 und A-B=4), Frage mit gemischten Formen
"""
from fractions import Fraction
import itertools

ALL_SHAPES = ["dreieck", "kreis", "quadrat", "stern", "herz", "raute"]
VMAX = 25          # Suchraum für count_solutions
HMAX = 100         # Suchraum für den "menschlichen" Löser (großzügiger -> sicherer)
PMAX = 40          # Suchraum für Paarschritte

LEVELS = {
    "beispiel": dict(k=(2, 2), vals=(1, 9), strich="+", punkt=False, neq=(2, 2), pair=(0, 0),
                     terms=(2, 3), qterms=(2, 3), shuffle=False, maxres=30),
    "leicht": dict(k=(3, 3), vals=(1, 10), strich="+-", punkt=False, neq=(3, 3), pair=(0, 0),
                   terms=(2, 3), qterms=(3, 3), shuffle=False, maxres=40),
    "mittel": dict(k=(3, 4), vals=(2, 12), strich="+-", punkt=True, neq=(3, 4), pair=(0, 0),
                   terms=(2, 3), qterms=(3, 3), shuffle=True, maxres=100),
    "schwer": dict(k=(4, 4), vals=(2, 20), strich="+-", punkt=True, neq=(4, 4), pair=(1, 2),
                   terms=(2, 3), qterms=(3, 4), shuffle=True, maxres=120),
}


def evaluate(terms, ops, values):
    """Links nach rechts, exakt als Bruch. Gibt None bei Division durch 0."""
    def val(t):
        return Fraction(t) if isinstance(t, int) else Fraction(values[t])
    acc = val(terms[0])
    for op, t in zip(ops, terms[1:]):
        x = val(t)
        if op == "+":
            acc += x
        elif op == "-":
            acc -= x
        elif op == "*":
            acc *= x
        else:
            if x == 0:
                return None
            acc /= x
    return acc


def count_solutions(data, limit=2):
    shapes = data["shapes"]
    eqs = data["equations"]
    # Reihenfolge: Formen, die in vielen Gleichungen vorkommen, zuerst
    order = sorted(shapes, key=lambda s: -sum(s in e["terms"] for e in eqs))
    idx = {s: i for i, s in enumerate(order)}
    # jede Gleichung prüfen, sobald ihre letzte Form belegt ist
    check_at = [[] for _ in order]
    for e in eqs:
        used = [idx[t] for t in e["terms"] if not isinstance(t, int)]
        check_at[max(used)].append(e)
    values = {}
    count = 0

    def rec(i):
        nonlocal count
        if i == len(order):
            count += 1
            return count >= limit
        for v in range(1, VMAX + 1):
            values[order[i]] = v
            if all(evaluate(e["terms"], e["ops"], values) == e["result"] for e in check_at[i]):
                if rec(i + 1):
                    return True
        del values[order[i]]
        return False

    rec(0)
    return count


# ---------------------------------------------------------------- menschlicher Löser
def human_solve(shapes, eqs):
    """Einzelschritte: Gleichung mit genau einer unbekannten Form.
    Paarschritt: zwei Gleichungen mit denselben zwei unbekannten Formen.
    Rückgabe (gelöst?, Einzelschritte, Paarschritte)."""
    known = {}
    singles = pairs = 0
    while len(known) < len(shapes):
        progress = False
        for e in eqs:
            unk = {t for t in e["terms"] if not isinstance(t, int) and t not in known}
            if len(unk) != 1:
                continue
            s = unk.pop()
            sols = [v for v in range(1, HMAX + 1)
                    if evaluate(e["terms"], e["ops"], {**known, s: v}) == e["result"]]
            if len(sols) != 1:
                continue
            known[s] = sols[0]
            singles += 1
            progress = True
            break
        if progress:
            continue
        cand = []
        for e in eqs:
            unk = frozenset(t for t in e["terms"] if not isinstance(t, int) and t not in known)
            if len(unk) == 2:
                cand.append((unk, e))
        for (u1, e1), (u2, e2) in itertools.combinations(cand, 2):
            if u1 != u2:
                continue
            a, b = sorted(u1)
            sols = []
            for va in range(1, PMAX + 1):
                for vb in range(1, PMAX + 1):
                    vals = {**known, a: va, b: vb}
                    if (evaluate(e1["terms"], e1["ops"], vals) == e1["result"]
                            and evaluate(e2["terms"], e2["ops"], vals) == e2["result"]):
                        sols.append((va, vb))
                        if len(sols) > 1:
                            break
                if len(sols) > 1:
                    break
            if len(sols) == 1:
                known[a], known[b] = sols[0]
                pairs += 1
                progress = True
                break
        if not progress:
            return False, singles, pairs
    return True, singles, pairs


# ---------------------------------------------------------------- Erzeugung
def _rand_line(rng, shapes, values, kind, nterms, maxres, must=None):
    """Zufällige Zeile mit gültigen Zwischenergebnissen (>= 0, ganzzahlig)."""
    for _ in range(200):
        terms = [rng.choice(shapes) for _ in range(nterms)]
        if must is not None and must not in terms:
            terms[rng.randrange(nterms)] = must
        if kind == "+":
            ops = ["+"] * (nterms - 1)
        elif kind == "+-":
            ops = [rng.choice("+-") for _ in range(nterms - 1)]
        else:
            ops = [rng.choice(["*", "*", "/"]) for _ in range(nterms - 1)]
        acc = values[terms[0]]
        ok = True
        for op, t in zip(ops, terms[1:]):
            x = values[t]
            if op == "+":
                acc += x
            elif op == "-":
                acc -= x
            elif op == "*":
                acc *= x
            else:
                if acc % x:
                    ok = False
                    break
                acc //= x
            if acc < 1 or acc > maxres:
                ok = False
                break
        if not ok or acc < 1:
            continue
        # keine trivialen/irreführenden Zeilen wie A - A, A : A, A x 1
        if kind in ("+", "+-"):
            sign = [1] + [1 if o == "+" else -1 for o in ops]
            # eine Form nie gleichzeitig mit + und − (keine A − A-Spielereien)
            if any({sg for sg, t2 in zip(sign, terms) if t2 == t} == {1, -1} for t in terms):
                continue
        else:
            sign = [1] + [1 if o == "*" else -1 for o in ops]
            if any({sg for sg, t2 in zip(sign, terms) if t2 == t} == {1, -1} for t in terms):
                continue
            if "/" in ops and nterms > 2:
                continue
        return {"terms": terms, "ops": ops, "result": acc}
    return None


def _make_line(rng, pool, values, kinds, nts, maxres, must=(), exact=False):
    """Zeile aus Formen `pool`, die alle Formen in `must` enthält (exact: genau die Formen aus pool)."""
    for _ in range(60):
        kind = rng.choice(kinds)
        nt = rng.choice(nts)
        if kind == "*" and nt > 2 and rng.random() < 0.5:
            nt = 2
        for _ in range(20):
            line = _rand_line(rng, pool, values, kind, nt, maxres)
            if line is None:
                break
            used = set(line["terms"])
            if not set(must) <= used:
                continue
            if exact and used != set(pool):
                continue
            return line
    return None


def _chain(rng, cfg, shapes, values, start_pair):
    """Gleichungsfolge, in der jede Zeile (bzw. ein Zeilenpaar) neue Formen bringt."""
    maxres = cfg["maxres"]
    kinds = ["+-", "*"] if cfg["punkt"] else [cfg["strich"]]
    eqs = []
    k = len(shapes)
    i = 0
    if start_pair:
        a, b = shapes[0], shapes[1]
        # zwei Zeilen mit genau diesen zwei Formen, verschiedene Art (z. B. Summe und Differenz)
        l1 = _make_line(rng, [a, b], values, kinds, (2,), maxres, exact=True)
        l2 = _make_line(rng, [a, b], values, kinds, (2, 3), maxres, exact=True)
        if l1 is None or l2 is None:
            return None
        eqs += [l1, l2]
        i = 2
    else:
        a = shapes[0]
        kind = rng.choice(kinds)
        nt = 2 if kind == "*" else rng.choice((2, 3))
        l = _rand_line(rng, [a], values, kind, nt, maxres)
        if l is None:
            return None
        eqs.append(l)
        i = 1
    while i < k:
        if not start_pair and cfg["pair"][0] > 0 and i == 1 and k - i >= 2:
            # Paar in der Mitte: zwei neue Formen, auch mit der bekannten
            b, c = shapes[1], shapes[2]
            l1 = _make_line(rng, [b, c], values, kinds, (2,), maxres, exact=True)
            l2 = _make_line(rng, [shapes[0], b, c], values, kinds, (3,), maxres, must=(b, c))
            if l1 is None or l2 is None:
                return None
            eqs += [l1, l2]
            i = 3
            continue
        new = shapes[i]
        pool = shapes[:i + 1]
        l = _make_line(rng, pool, values, kinds, cfg["terms"], maxres, must=(new,))
        if l is None:
            return None
        eqs.append(l)
        i += 1
    return eqs


def generate(level, rng):
    cfg = LEVELS[level]
    lo, hi = cfg["vals"]
    for _ in range(5000):
        k = rng.randint(*cfg["k"])
        shapes = rng.sample(ALL_SHAPES, k)
        vals = rng.sample(range(lo, hi + 1), k)
        values = dict(zip(shapes, vals))
        if level in ("beispiel", "leicht"):
            # Kette: Zeile i bringt Form i neu hinzu
            eqs = []
            for i in range(k):
                s = shapes[i]
                pool = shapes[:i + 1]
                nt = 3 if i == 0 and level == "leicht" else rng.randint(*cfg["terms"])
                if i == 0:
                    line = _rand_line(rng, [s], values, "+", nt, cfg["maxres"])
                else:
                    line = _make_line(rng, pool, values, [cfg["strich"]], (nt,), cfg["maxres"], must=(s,))
                    if line is not None and len(set(line["terms"])) < 2:
                        line = None
                if line is None:
                    break
                eqs.append(line)
            if len(eqs) < k:
                continue
        else:
            eqs = _chain(rng, cfg, shapes, values, start_pair=cfg["pair"][0] > 0 and rng.random() < 0.5)
            if eqs is None:
                continue
            if cfg["shuffle"]:
                rng.shuffle(eqs)
        # keine doppelten Zeilen
        if len({(tuple(e["terms"]), tuple(e["ops"])) for e in eqs}) < len(eqs):
            continue
        ok, singles, pairs = human_solve(shapes, eqs)
        if not ok or not (cfg["pair"][0] <= pairs <= cfg["pair"][1]):
            continue
        # Frage: gemischte Formen
        qk = rng.randint(*cfg["qterms"])
        qkind = cfg["strich"]
        if cfg["punkt"] and rng.random() < 0.35:
            qkind = "*"
            qk = min(qk, 3)
        need = 2 if level == "beispiel" else 3
        q = _make_line(rng, shapes, values, [qkind], (qk,), cfg["maxres"])
        if q is None or len(set(q["terms"])) < min(need, qk):
            continue
        # Frage darf keine Gleichung in anderer Reihenfolge sein
        if any(sorted(zip(["+"] + q["ops"], q["terms"])) == sorted(zip(["+"] + e["ops"], e["terms"]))
               for e in eqs):
            continue
        allops = [o for e in eqs for o in e["ops"]] + q["ops"]
        if level != "beispiel" and "-" not in allops:
            continue
        if cfg["punkt"] and ("/" not in allops or "*" not in allops):
            continue
        data = {"shapes": shapes, "equations": eqs,
                "question": {"terms": q["terms"], "ops": q["ops"]}}
        if count_solutions(data) != 1:
            continue
        return {"data": data, "solution": {"values": values, "answer": q["result"]}}
    raise RuntimeError("kein Symbolrätsel gefunden")
