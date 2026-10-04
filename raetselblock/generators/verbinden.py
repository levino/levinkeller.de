"""Verbinden (Arukone / Numberlink): gleiche Buchstaben verbinden, alle Felder nutzen."""
from .verbinden_core import generate as _gen, solve_all

LEVELS = {
    "beispiel": (5, (4, 4)),
    "leicht": (6, (5, 6)),
    "mittel": (7, (6, 7)),
    "schwer": (8, (7, 8)),
}


def generate(level, rng):
    n, pairs = LEVELS[level]
    while True:
        res = _gen(n, pairs, rng)
        if res:
            ends, paths = res
            return {
                "data": {"size": n, "ends": {k: [list(a), list(b)] for k, (a, b) in sorted(ends.items())}},
                "solution": {"paths": {k: [list(c) for c in p] for k, p in sorted(paths.items())}},
            }


def count_solutions(data, limit=2):
    ends = {k: (tuple(v[0]), tuple(v[1])) for k, v in data["ends"].items()}
    return len(solve_all(data["size"], ends, limit=limit))
