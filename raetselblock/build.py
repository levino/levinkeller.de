"""Baut den Rätselblock: Rätsel erzeugen -> data/block.json -> Typst -> pdf/raetselblock.pdf

    python3 build.py                  # ganzer Block
    python3 build.py --seed 7         # anderer Block, gleiche Struktur
    python3 build.py --only hashi     # nur ein Kapitel (zum Testen)
"""
import argparse
import importlib
import json
import random
import time
from pathlib import Path

ROOT = Path(__file__).parent

# Reihenfolge: Rechnen und Logik im Wechsel. counts = Anzahl Rätsel je Stufe.
CHAPTERS = [
    ("zahlenmauern",   {"leicht": 4, "mittel": 4, "schwer": 4}),
    ("verbinden",      {"leicht": 2, "mittel": 3, "schwer": 3}),
    ("rechenkaefige",  {"leicht": 2, "mittel": 4, "schwer": 2}),
    ("kronen",         {"leicht": 2, "mittel": 4, "schwer": 2}),
    ("symbolrechnen",  {"leicht": 4, "mittel": 4, "schwer": 4}),
    ("zahlenpfad",     {"leicht": 2, "mittel": 4, "schwer": 2}),
    ("kreuzrechnen",   {"leicht": 2, "mittel": 2, "schwer": 2}),
    ("sonnemond",      {"leicht": 2, "mittel": 3, "schwer": 3}),
    ("sudoku",         {"leicht": 2, "mittel": 4, "schwer": 2}),
    ("zauberquadrate", {"leicht": 2, "mittel": 2, "schwer": 2}),
    ("groesserkleiner", {"leicht": 2, "mittel": 2, "schwer": 2}),
    ("kreuzsummen",    {"leicht": 2, "mittel": 2, "schwer": 2}),
    ("bruecken",       {"leicht": 2, "mittel": 2, "schwer": 2}),
    ("bilderraetsel",  {"leicht": 2, "mittel": 2, "schwer": 2}),
]


def build_data(seed, only=None):
    chapters = []
    for idx, (ctype, counts) in enumerate(CHAPTERS, 1):
        if only and ctype not in only:
            continue
        gen = importlib.import_module(f"generators.{ctype}")
        crng = random.Random(f"{seed}-{ctype}")
        t0 = time.time()
        example = gen.generate("beispiel", crng)
        puzzles, seen = [], {json.dumps(example["data"], sort_keys=True)}
        for level in ("leicht", "mittel", "schwer"):
            made = 0
            while made < counts.get(level, 0):
                p = gen.generate(level, crng)
                key = json.dumps(p["data"], sort_keys=True)
                if key in seen:
                    continue
                seen.add(key)
                p["level"] = level
                puzzles.append(p)
                made += 1
        for i, p in enumerate(puzzles, 1):
            p["number"] = i
        example["level"] = "beispiel"
        chapters.append({"index": idx, "type": ctype, "example": example, "puzzles": puzzles})
        print(f"{idx:2d} {ctype:16s} {len(puzzles):2d} Rätsel  {time.time() - t0:5.1f}s")
    return {"seed": seed, "chapters": chapters}


def write_registry(types, name="registry.typ"):
    lines = ["// automatisch von build.py erzeugt"]
    for t in types:
        lines.append(f'#import "types/{t}.typ" as {t}')
    lines.append("#let registry = (" + ", ".join(f"{t}: {t}" for t in types) + ",)")
    (ROOT / "typst" / name).write_text("\n".join(lines) + "\n")


def compile_pdf(out, tag=""):
    import typst
    sys_inputs = {"data": f"/data/block{tag}.json", "registry": f"registry{tag}.typ"}
    # Systemschriften werden automatisch gefunden; zusätzlich ein lokaler fonts/-Ordner, falls vorhanden.
    font_paths = [str(p) for p in (ROOT / "fonts", Path("/usr/share/fonts")) if p.is_dir()]
    typst.compile(str(ROOT / "typst" / "block.typ"), output=str(out), root=str(ROOT),
                  font_paths=font_paths, sys_inputs=sys_inputs)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=2026)
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--out", default="pdf/raetselblock.pdf")
    ap.add_argument("--no-pdf", action="store_true")
    ap.add_argument("--tag", default="", help="separate data/registry files, e.g. for parallel tests")
    args = ap.parse_args()

    data = build_data(args.seed, args.only)
    (ROOT / "data").mkdir(exist_ok=True)
    tag = f"-{args.tag}" if args.tag else ""
    (ROOT / "data" / f"block{tag}.json").write_text(json.dumps(data, ensure_ascii=False))
    write_registry(sorted({c["type"] for c in data["chapters"]}), f"registry{tag}.typ")
    if not args.no_pdf:
        out = ROOT / args.out
        out.parent.mkdir(exist_ok=True)
        compile_pdf(out, tag)
        print("PDF:", out)


if __name__ == "__main__":
    main()
