#!/usr/bin/env python3
"""
One-off: fill messages/de.json and messages/fr.json from en.json using deep_translator.
Skips URL-like strings, slug fields, and preserves placeholders {var}.
"""

import json
import re
import sys
import time
from pathlib import Path

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("pip install deep-translator", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
EN_PATH = ROOT / "messages" / "en.json"
DE_PATH = ROOT / "messages" / "de.json"
FR_PATH = ROOT / "messages" / "fr.json"

# Keys whose string values are technical slugs / codes
SKIP_VALUE_KEYS = frozenset({"slug"})

PLACEHOLDER_RE = re.compile(r"(\{[^}]+\})")


def protect_placeholders(s: str) -> tuple[str, list[str]]:
    parts = PLACEHOLDER_RE.split(s)
    tokens: list[str] = []
    out: list[str] = []
    for i, p in enumerate(parts):
        if PLACEHOLDER_RE.fullmatch(p):
            tokens.append(p)
            out.append(f"__PH_{len(tokens) - 1}__")
        else:
            out.append(p)
    return "".join(out), tokens


def restore_placeholders(s: str, tokens: list[str]) -> str:
    for i, tok in enumerate(tokens):
        s = s.replace(f"__PH_{i}__", tok)
    return s


def should_skip_translation(s: str) -> bool:
    if not s.strip():
        return True
    if s.startswith("http://") or s.startswith("https://"):
        return True
    if re.fullmatch(r"[A-Z]{2}", s):  # TR, EN, DE, FR codes
        return True
    if s in ("TR", "EN", "DE", "FR", "TOPRAK & CO. — CREATIVE AGENCY"):
        return False
    return False


def translate_text(translator: GoogleTranslator, text: str) -> str:
    if should_skip_translation(text):
        return text
    if re.search(r"05XX|₺|toprakco\.tr", text):
        return text
    protected, tokens = protect_placeholders(text)
    # Very short brand-only lines
    if "Toprak & Co." in text and len(text) < 40:
        pass
    try:
        time.sleep(0.12)
        out = translator.translate(protected)
    except Exception as e:
        print(f"WARN translate fail: {text[:50]}... -> {e}", file=sys.stderr)
        return text
    return restore_placeholders(out, tokens)


def walk(key_path: str, obj: object, translator: GoogleTranslator) -> object:
    if isinstance(obj, dict):
        return {
            k: walk(
                f"{key_path}.{k}" if key_path else k,
                v,
                translator,
            )
            for k, v in obj.items()
        }
    if isinstance(obj, list):
        return [walk(f"{key_path}[{i}]", item, translator) for i, item in enumerate(obj)]
    if isinstance(obj, str):
        leaf_key = key_path.split(".")[-1].split("[")[0]
        if leaf_key in SKIP_VALUE_KEYS:
            return obj
        return translate_text(translator, obj)
    return obj


def main() -> None:
    data = json.loads(EN_PATH.read_text(encoding="utf-8"))
    print("Translating EN → DE …", flush=True)
    de = walk("", data, GoogleTranslator(source="en", target="de"))
    DE_PATH.write_text(json.dumps(de, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {DE_PATH}", flush=True)

    print("Translating EN → FR …", flush=True)
    fr = walk("", data, GoogleTranslator(source="en", target="fr"))
    FR_PATH.write_text(json.dumps(fr, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {FR_PATH}", flush=True)


if __name__ == "__main__":
    main()
