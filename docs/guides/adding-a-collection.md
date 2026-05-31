---
layout: default
title: "Adding a New Collection"
---

# Adding a New Collection (Normative Text)

How to add a new sacred text (e.g. Hanuman Bahuk, Hanuman Kavacham) end-to-end — from the **definitive source text** through to a published, navigable collection on the site.

The pipeline **begins with the definitive text** in `data/sources/`, not with `data/verses/`:

```
data/sources/{collection}.txt   →   data/verses/{collection}.yml   →   _verses/ + audio/ + images/ + embeddings   →   publish
   (1) authoritative raw text       (2) structured verses               (3) verse-generate (SDK)                     (4) enable + test
```

---

## Step 1 — Add the definitive text → `data/sources/{collection}.txt`

This is the authoritative, human-verified source of truth. Everything downstream is derived from it.

- **Filename**: `{collection}.txt` (or `{collection}-{source}.txt`, e.g. `hanuman-bahuk-gita-press.txt`). Use hyphens, UTF-8, Devanagari.
- **Header**: start the file with provenance — source URL, date retrieved, structure (verse count + meters), and any editorial notes (cleanups, OCR/number anomalies). See `data/sources/hanuman-bahuk.txt` for a worked example.
- **Keep meter/section markers inline** (e.g. `॥दोहा॥`, `॥चौपाई॥`, `छप्पय`, `घनाक्षरी`). These drive verse typing during parsing — see `data/sources/bajrang-baan.txt`.
- **Register it** in `data/sources/README.md` (Files section + QA checklist).

> Do not silently "fix" the sacred text. Flag anomalies in the header and resolve them in Step 2, where the structured numbers actually matter.

## Step 2 — Parse into structured verses → `data/verses/{collection}.yml`

Convert the raw text into the canonical structured form the SDK consumes:

```yaml
_meta:
  collection: {collection}          # must match the key in _data/collections.yml
  source: <attribution>
  description: <short description>
  sequence:                         # every verse ID in reading order — drives --next
  - verse-01
  - verse-02
verse-01:
  devanagari: |
    ...
```

- **Verse IDs use hyphens** (`verse-01`, `chaupai-01`, `pada-01`) — never underscores. IDs become filenames, permalinks, audio, and image names.
- For mixed-meter texts, capture the meter in `verse_type` and keep a single global numbering in `_meta.sequence` (or prefix by meter — decide up front, since IDs are load-bearing everywhere).
- **How to parse**: extend a script under `scripts/` (see `scripts/parse-sundar-kaand.py`, `scripts/add-canonical-verse.py`) for large texts, or hand-structure short ones (< ~50 verses). Use `data/verses/TEMPLATE.yml` as a starting point.
- Fix any source numbering anomalies here (this is where verse numbers are authoritative).

## Step 3 — Generate content with the SDK

Per-verse this creates the markdown, image, audio (full + slow), embeddings, and nav links. Run in the virtual environment:

```bash
set -a && source .env && set +a
./venv/bin/verse-generate \
  --collection {collection} \
  --next \
  --auto-generate-scene
```

Loop `--next` until `_meta.sequence` is exhausted. See [content-generation.md](content-generation.md) for image/audio/embedding options. (~$0.05–0.06/verse.)

Optionally pre-author `data/scenes/{collection}.yml` and `data/themes/{collection}/modern-minimalist.yml` instead of relying on `--auto-generate-scene`.

## Step 4 — Register & publish

1. **`_data/collections.yml`** — add (or flip) the entry to `enabled: true`. Required fields: `key`, `name_en`/`name_hi`, `author_en`/`author_hi`, `description_en`/`description_hi`, `permalink_base`, `icon`, `subdirectory`, `enabled`. Enabling moves it from the "Coming Soon" include into the active collections grid + Library.
2. **`_data/themes.yml`** — add a `{collection}` block with at least the `modern-minimalist` theme.
3. **`_layouts/verse.html`** — add `{collection}` to the audio-rendering `{% if %}` conditional, or audio players won't show.
4. **`{collection}/index.html`** — the landing page (most are pre-scaffolded; it auto-populates from `site.verses` filtered by `collection_key`).

## Step 5 — Test & ship

```bash
bundle exec jekyll serve --force_polling   # http://localhost:4000/
```

Verify verses render, navigation (prev/next) works, audio + images load, and the collection appears on the home + Library pages. Then commit (with the `Co-Authored-By` trailer) and push.

---

## Checklist

- [ ] `data/sources/{collection}.txt` added with provenance header + registered in `data/sources/README.md`
- [ ] `data/verses/{collection}.yml` created (`_meta.sequence` + per-verse `devanagari`, hyphenated IDs, numbering corrected)
- [ ] Verses generated via `verse-generate` (`_verses/`, `audio/`, `images/`, embeddings)
- [ ] `_data/collections.yml` → `enabled: true`
- [ ] `_data/themes.yml` block added
- [ ] `_layouts/verse.html` audio conditional updated
- [ ] Tested locally, then committed + pushed
