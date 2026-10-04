"""Prüft alle Rätsel in data/block.json unabhängig: genau eine Lösung je Rätsel.

    python3 verify.py                 # prüft data/block.json
    python3 verify.py data/block-x.json
"""
import importlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "data" / "block.json"
    data = json.loads(path.read_text())
    bad = 0
    total = 0
    for ch in data["chapters"]:
        gen = importlib.import_module(f"generators.{ch['type']}")
        for p in [ch["example"], *ch["puzzles"]]:
            total += 1
            n = gen.count_solutions(p["data"], limit=2)
            if n != 1:
                bad += 1
                print(f"FEHLER {ch['index']}.{p.get('number', 'Beispiel')} {ch['type']}: {n} Lösungen")
        print(f"{ch['index']:2d} {ch['type']:16s} ok")
    print(f"{total - bad}/{total} Rätsel eindeutig lösbar")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
