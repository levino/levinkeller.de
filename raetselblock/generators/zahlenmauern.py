"""Zahlenmauern: jeder Stein ist Summe (Plus-Mauer) bzw. Produkt (Mal-Mauer) der zwei Steine darunter.

Steine: Reihe r = 0 (Spitze) .. n-1 (unten), Reihe r hat r+1 Steine. Stein (r, i) steht auf
(r+1, i) und (r+1, i+1).

data     = {"rows": n, "op": "+" | "*", "givens": [[...], ...]}   (0 = leer)
solution = {"values": [[...], ...]}

Stufen (menschlicher Löser mit Techniken "lokal" = aus zwei Steinen eines Dreiecks den dritten,
"trick" = Teilmauer mit bekannter Spitze und genau einem unbekannten Fußstein):
  beispiel 3 Reihen Plus, kleine Zahlen, mindestens ein Rückwärts-Schritt
  leicht   4 Reihen Plus, Spitze <= 100, nur lokal, 1-3 Rückwärts-Schritte
  mittel   abwechselnd 5 Reihen Plus (Spitze <= 200, >= 3 Rückwärts-Schritte)
           und 3 Reihen Mal (Spitze <= 400, mindestens eine Division)
  schwer   abwechselnd 5 Reihen Plus, nur mit Trick lösbar (unterste Reihe großteils leer),
           und 4 Reihen Mal mit kleinen Basiszahlen (Divisionen bzw. Trick)
"""
from math import comb

LEVELS = {
    "beispiel": [dict(n=3, op="+", base=(1, 6), top=(8, 20), tech=("local",), back=(1, 2), trick=(0, 0))],
    "leicht": [dict(n=4, op="+", base=(1, 18), top=(40, 100), tech=("local",), back=(1, 3), trick=(0, 0))],
    "mittel": [
        dict(n=5, op="+", base=(1, 22), top=(110, 200), tech=("local",), back=(3, 9), trick=(0, 0)),
        dict(n=3, op="*", base=(2, 9), top=(60, 400), tech=("local",), back=(1, 3), trick=(0, 0)),
    ],
    "schwer": [
        dict(n=5, op="+", base=(1, 20), top=(100, 200), tech=("local", "trick"), back=(0, 99), trick=(1, 3)),
        dict(n=4, op="*", base=(1, 4), top=(40, 300), tech=("local", "trick"), back=(3, 99), trick=(0, 2)),
    ],
}


def _build(base, op):
    n = len(base)
    rows = [None] * n
    rows[n - 1] = list(base)
    for r in range(n - 2, -1, -1):
        below = rows[r + 1]
        rows[r] = [below[i] + below[i + 1] if op == "+" else below[i] * below[i + 1] for i in range(r + 1)]
    return rows


def _iroot(x, k):
    """Ganzzahlige k-te Wurzel oder None."""
    if x < 1:
        return None
    r = round(x ** (1.0 / k))
    for c in (r - 1, r, r + 1):
        if c >= 1 and c ** k == x:
            return c
    return None


def human_solve(n, op, givens, tech=("local", "trick")):
    """Löst wie ein Kind. Rückgabe (vollständig?, Anzahl Rückwärtsschritte, Anzahl Tricks, Werte)."""
    v = [row[:] for row in givens]
    back = tricks = 0
    plus = op == "+"

    def ok(x):
        return x is not None and x >= 1

    while True:
        progress = False
        for r in range(n - 1):
            for i in range(r + 1):
                t, a, b = v[r][i], v[r + 1][i], v[r + 1][i + 1]
                known = (t > 0) + (a > 0) + (b > 0)
                if known != 2:
                    continue
                if t == 0:
                    v[r][i] = a + b if plus else a * b
                else:
                    other = b if a == 0 else a
                    if plus:
                        x = t - other
                    else:
                        x = t // other if t % other == 0 else None
                    if not ok(x):
                        return False, back, tricks, v
                    if a == 0:
                        v[r + 1][i] = x
                    else:
                        v[r + 1][i + 1] = x
                    back += 1
                progress = True
        if progress:
            continue
        if "trick" in tech:
            # Teilmauer: Spitze (r,i) bekannt, Fuß in Reihe r+h-1 mit genau einem unbekannten Stein
            for r in range(n):
                for i in range(r + 1):
                    if v[r][i] == 0:
                        continue
                    for h in range(3, n - r + 1):
                        fr = r + h - 1
                        foot = [v[fr][i + j] for j in range(h)]
                        unknown = [j for j in range(h) if foot[j] == 0]
                        if len(unknown) != 1:
                            continue
                        u = unknown[0]
                        c = comb(h - 1, u)
                        if plus:
                            rest = v[r][i] - sum(comb(h - 1, j) * foot[j] for j in range(h) if j != u)
                            x = rest // c if rest > 0 and rest % c == 0 else None
                        else:
                            prod = 1
                            for j in range(h):
                                if j != u:
                                    prod *= foot[j] ** comb(h - 1, j)
                            x = _iroot(v[r][i] // prod, c) if v[r][i] % prod == 0 else None
                        if not ok(x):
                            return False, back, tricks, v
                        v[fr][i + u] = x
                        tricks += 1
                        progress = True
                        break
                    if progress:
                        break
                if progress:
                    break
        if not progress:
            break
    done = all(x > 0 for row in v for x in row)
    return done, back, tricks, v


def count_solutions(data, limit=2):
    """Unabhängig: Suche über die unterste Reihe (alle Werte >= 1) mit Schranken aus den Vorgaben."""
    n, op, g = data["rows"], data["op"], data["givens"]
    plus = op == "+"
    cons = []   # (wert, {fußindex: koeffizient})
    for r in range(n):
        for i in range(r + 1):
            if g[r][i]:
                h = n - r
                cons.append((g[r][i], {i + j: comb(h - 1, j) for j in range(h)}))
    # Jeder Fußstein muss von einer Vorgabe "überdeckt" sein, sonst beliebig groß
    ub = []
    for j in range(n):
        cover = [val for val, w in cons if j in w]
        if not cover:
            return limit
        ub.append(min(cover))
    # Constraints nach letztem beteiligten Index sortiert prüfen
    count = 0
    base = [0] * n

    def feasible(k):
        # base[0..k] gesetzt
        for val, w in cons:
            if plus:
                part = sum(c * base[j] for j, c in w.items() if j <= k)
                rest = sum(c for j, c in w.items() if j > k)
                if part + rest > val:
                    return False
                if rest == 0 and part != val:
                    return False
            else:
                part = 1
                for j, c in w.items():
                    if j <= k:
                        part *= base[j] ** c
                if val % part:
                    return False
                if max(w) <= k and part != val:
                    return False
        return True

    def rec(k):
        nonlocal count
        if k == n:
            count += 1
            return count >= limit
        for x in range(1, ub[k] + 1):
            base[k] = x
            if feasible(k):
                if rec(k + 1):
                    return True
        base[k] = 0
        return False

    rec(0)
    return count


def _turn(rng, level, k):
    """Abwechselnde Wahl der Variante je Stufe (Zustand am rng-Objekt, damit deterministisch)."""
    key = "_zahlenmauern_turn_" + level
    t = getattr(rng, key, 0)
    setattr(rng, key, t + 1)
    return t % k


def generate(level, rng):
    variants = LEVELS[level]
    cfg = variants[_turn(rng, level, len(variants))]
    n, op = cfg["n"], cfg["op"]
    lo, hi = cfg["base"]
    for _ in range(20000):
        base = [rng.randint(lo, hi) for _ in range(n)]
        if op == "*" and level == "schwer":
            if base.count(1) > 1 or max(base) > 4:
                continue
        vals = _build(base, op)
        if not (cfg["top"][0] <= vals[0][0] <= cfg["top"][1]):
            continue
        if op == "*" and level == "schwer" and max(max(r) for r in vals) > 300:
            continue
        # Vorgaben reduzieren
        cells = [(r, i) for r in range(n) for i in range(r + 1)]
        rng.shuffle(cells)
        givens = [row[:] for row in vals]
        for r, i in cells:
            keep = givens[r][i]
            givens[r][i] = 0
            if not human_solve(n, op, givens, cfg["tech"])[0]:
                givens[r][i] = keep
        done, back, tricks, _ = human_solve(n, op, givens, cfg["tech"])
        if not done:
            continue
        if not (cfg["back"][0] <= back <= cfg["back"][1] and cfg["trick"][0] <= tricks <= cfg["trick"][1]):
            continue
        if level == "schwer" and op == "+":
            # unterste Reihe großteils leer
            if sum(1 for x in givens[n - 1] if x) > 2:
                continue
        if level in ("leicht", "beispiel") and givens[0][0] == 0 and sum(1 for x in givens[n - 1] if x) == n:
            continue
        data = {"rows": n, "op": op, "givens": givens}
        if count_solutions(data) != 1:
            continue
        return {"data": data, "solution": {"values": vals}}
    raise RuntimeError("keine Zahlenmauer gefunden")
