---
layout: default
title: "Puranic Context"
---

# Puranic Context

Verse pages can display grounded story references from indexed sacred texts via a two-stage SDK workflow.

## Stage 1 — Index a Source Text

```bash
set -a && source .env && set +a
./venv/bin/verse-index-sources \
  --file data/sources/ananda-ramayan.txt \
  --project-dir .
```

Outputs:
- `data/puranic-index/{key}.yml` — episode index with `_meta` (legend, provider, chunk size)
- `data/embeddings/puranic/{key}.json` — OpenAI embedding vectors

Run once per source. Use `--update-meta` to refresh `_meta` without re-indexing.

## Stage 2 — Generate Context per Verse

```bash
set -a && source .env && set +a
./venv/bin/verse-puranic-context \
  --collection hanuman-chalisa \
  --all
```

For each verse: embeds the verse → cosine similarity search across all indexed sources → GPT-4 generates structured context citing the exact source section → writes `puranic_context:` block into the verse `.md` file.

Subject is resolved automatically: collection-level `subject` in `_data/collections.yml` → project-level `defaults.subject` in `_data/verse-config.yml`.

```bash
# Skip verses that already have context (default)
verse-puranic-context --collection hanuman-chalisa --all

# Regenerate all
verse-puranic-context --collection hanuman-chalisa --all --regenerate

# Single verse
verse-puranic-context --collection hanuman-chalisa --verse chaupai-06
```

## Indexed Sources

| Key | File | Episodes |
|---|---|---|
| shiv-puran-part1 | data/sources/shiv-puran-part1.txt | 1009 |
| ananda-ramayan | data/sources/ananda-ramayan.txt | 504 |

Priority sources to add: Brahmanda Purana (Adhyatma Ramayana), Mahabharata Vana Parva, Parasara Samhita — see [GitHub issues](https://github.com/sanatan-learnings/hanuman-gpt/issues).

## Quality Rules

Only entries with a **genuine section citation** from the indexed source are kept. Entries with placeholder sections (`Not directly mentioned`, `N/A`, `Not applicable`) indicate hallucination and must be removed.

The `puranic_context:` YAML structure in verse files:

```yaml
puranic_context:
- id: hanuman-shiva-avatar
  type: concept          # story | concept | character | etymology | cross_reference
  priority: high         # high | medium | low (display order only, no visual difference)
  title:
    en: Hanuman as an Avatar of Shiva
    hi: हनुमान शिव के अवतार के रूप में
  icon: 🔱
  story_summary:
    en: ...
    hi: ...
  theological_significance:
    en: ...
    hi: ...
  practical_application:
    en: ...
    hi: ...
  source_texts:
  - text: Shiv Puran Part1
    section: Rudrasamhita, Kumarakhanda   # must be a real section
  related_verses: []
```
