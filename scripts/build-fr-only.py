#!/usr/bin/env python3
"""Fill messages/fr.json from en.json (FR only). See build-de-fr-messages.py for logic."""

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
FR_PATH = ROOT / "messages" / "fr.json"
SKIP_VALUE_KEYS = frozenset({"slug"})
PLACEHOLDER_RE = re.compile(r"(\{[^}]+\})")


def protect_placeholders(s: str) -> tuple[str, list[str]]:
    parts = PLACEHOLDER_RE.split(s)
    tokens: list[str] = []
    out: list[str] = []
    for p in parts:
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
    if re.fullmatch(r"[A-Z]{2}", s):
        return True
    if s == "✦":
        return True
    return False


def translate_text(translator: GoogleTranslator, text: str) -> str:
    if should_skip_translation(text):
        return text
    if re.search(r"05XX|₺|toprakco\.tr", text):
        return text
    protected, tokens = protect_placeholders(text)
    try:
        time.sleep(0.08)
        out = translator.translate(protected)
    except Exception as e:
        print(f"WARN: {text[:40]}… -> {e}", file=sys.stderr)
        return text
    return restore_placeholders(out, tokens)


def walk(key_path: str, obj: object, translator: GoogleTranslator) -> object:
    if isinstance(obj, dict):
        return {
            k: walk(f"{key_path}.{k}" if key_path else k, v, translator)
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
    print("EN → FR …", flush=True)
    fr = walk("", data, GoogleTranslator(source="en", target="fr"))
    FR_PATH.write_text(json.dumps(fr, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK {FR_PATH}", flush=True)


if __name__ == "__main__":
    main()
