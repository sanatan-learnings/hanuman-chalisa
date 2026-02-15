# Canonical Verse Files

This directory contains the authoritative Devanagari text for all verse collections in YAML format. These are the single source of truth for all verses.

## File Format

All collection files follow a standardized format (see `TEMPLATE.yml` for reference):

```yaml
_meta:
  collection: collection-name
  source: Original source attribution
  description: Brief description
  sequence:
  - verse-id-01
  - verse-id-02
  # ... ordered list of all verses

verse-id-01:
  devanagari: [Devanagari text]

verse-id-02:
  devanagari: [Devanagari text]
```

### Key Features
- **`_meta.sequence`**: Ordered list of all verse IDs (used for navigation and numbering)
- **Verse IDs**: Use hyphens (e.g., `chaupai-01`, `doha-01`, `shloka-01`)
- **Direct key-value format**: Each verse ID maps directly to its content
- **Single-line Devanagari**: SDK handles formatting for display

## Collections

### hanuman-chalisa.yml
- **Source**: Traditional Hanuman Chalisa by Goswami Tulsidas
- **Total verses**: 43
  - 2 opening dohas (`doha-01`, `doha-02`)
  - 40 chaupais (`chaupai-01` to `chaupai-40`)
  - 1 closing doha (`doha-closing`)
- **Description**: Complete Hanuman Chalisa with 40 verses praising Lord Hanuman

### sundar-kaand.yml
- **Source**: [Wikipedia](https://hi.wikipedia.org/wiki/%E0%A4%B8%E0%A5%81%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1)
- **Structure**: 3 opening shlokas + alternating chaupais and dohas (~60 sets)
- **Total verses**: 580+ verses
  - 3 shlokas (opening invocations: `shloka-01` to `shloka-03`)
  - 522 chaupais (`chaupai-01` to `chaupai-522`)
  - 58 dohas (`doha-01` to `doha-58`)
- **Description**: Sundar Kaand from Ramcharitmanas by Goswami Tulsidas

#### ⚠️ Known Issue

**Traditional count discrepancy** - See [GitHub Issue #14](https://github.com/sanatan-learnings/hanuman-gpt/issues/14)

- Traditional Ramcharitmanas: **524 chaupais + 60 dohas**
- Our Wikipedia source: **522 chaupais + 58 dohas**
- **Difference**: Missing 2 chaupais and 2 dohas

Investigation needed to determine if Wikipedia source is incomplete or uses different counting methodology.

### sankat-mochan-hanumanashtak.yml
- **Source**: Traditional Sankat Mochan Hanumanashtak
- **Total verses**: 8
  - 8 verses (`verse-01` to `verse-08`)
- **Description**: Eight verses for removing obstacles, attributed to Goswami Tulsidas

## Creating New Collections

Use `TEMPLATE.yml` as a starting point for new collections. Follow these guidelines:

1. **Naming**: Use hyphens for verse IDs (e.g., `chaupai-01`, NOT `chaupai_01`)
2. **Sequence**: List ALL verses in reading order in `_meta.sequence`
3. **Format**: Use direct key-value structure (see template)
4. **Consistency**: Match the format of existing collections

## Usage

### Reading Verse Data

```python
import yaml

# Load collection
with open('data/verses/hanuman-chalisa.yml', 'r', encoding='utf-8') as f:
    data = yaml.safe_load(f)

# Access metadata
collection = data['_meta']['collection']
sequence = data['_meta']['sequence']

# Access verse text
verse_text = data['chaupai-01']['devanagari']

# Iterate through all verses in order
for verse_id in sequence:
    print(f"{verse_id}: {data[verse_id]['devanagari']}")
```

### Using with SDK

The `verse-generate` command automatically reads from these files:

```bash
# Generate verse with auto-inferred ID from sequence
./venv/bin/verse-generate \
  --collection hanuman-chalisa \
  --verse doha-01 \
  --regenerate-content \
  --all
```

The SDK uses:
- `_meta.sequence` to determine verse order and numbering
- Verse IDs from the sequence to create properly named files
- Devanagari text as the canonical source for all generated content

## File Structure

```
data/verses/
├── README.md                           # This file
├── TEMPLATE.yml                        # Template for new collections
├── hanuman-chalisa.yml                 # Hanuman Chalisa (43 verses)
├── sundar-kaand.yml                    # Sundar Kaand (580+ verses)
└── sankat-mochan-hanumanashtak.yml     # Sankat Mochan (8 verses)
```

## Notes

- These files are the **single source of truth** for all verse text
- All verse markdown files in `_verses/` are generated from these canonical files
- When regenerating verses, always use `--regenerate-content` flag to pull from these files
- Changes to Devanagari text should be made here, not in individual verse markdown files
