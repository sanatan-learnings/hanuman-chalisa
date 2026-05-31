# Sources

This directory contains authoritative source texts for sacred verse collections in their original format, used as input for parsing into structured verse files.

## Purpose

- **Authoritative Sources**: Original texts from reliable sources (Wikipedia, sacred text websites, scholarly editions)
- **Parsing Input**: These files are parsed to generate the structured YAML files in `data/verses/`
- **Version Control**: Track changes to source texts over time
- **Attribution**: Clearly document the source and provenance of each text

## Files

### sundar-kaand-wikipedia.txt
- **Source**: https://hi.wikipedia.org/wiki/%E0%A4%B8%E0%A5%81%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1
- **Description**: Sundar Kaand from Ramcharitmanas by Goswami Tulsidas (Wikipedia version)
- **Format**: Plain text with Devanagari script
- **Structure**:
  - 3 opening shlokas
  - 522 chaupais (single lines ending with ॥)
  - 58 dohas (marked with "दोहा" or "दो०")
  - 14 chhanda verses (in 3 sections with different meter)
  - 1 soratha
  - Closing benediction
- **⚠️ Known Issue**: Traditional count is 524 chaupais + 60 dohas. This source has 522 + 58. See [Issue #14](https://github.com/sanatan-learnings/hanuman-gpt/issues/14)

### hanuman-bahuk.txt
- **Source**: https://navbharattimes.indiatimes.com/astro/religion-rituals/arti-bhajan/hanuman-bahuk-path-lyrics-in-hindi/articleshow/120234026.cms
- **Retrieved**: 2026-05-31
- **Description**: Hanuman Bahuk by Goswami Tulsidas — devotional hymn composed during illness
- **Format**: Plain text with Devanagari script; meter section headers (छप्पय / झूलना / घनाक्षरी / सवैया) kept inline
- **Structure**: 44 verses across mixed meters — छप्पय (1-2), झूलना (3), घनाक्षरी (4-15), सवैया (16-19), घनाक्षरी (20-35), सवैया (36), घनाक्षरी (37-44)
- **⚠️ Editorial notes**:
  - 7 consecutive duplicate lines (paste artifacts) were removed before saving — verses 3, 6, 9, 12, 15, 39, 42.
  - Verse-number OCR errors left as-is in the source and to be corrected during parsing: verse 15 shows `॥९५॥`, verse 21 shows `॥२२१॥`, verse 41 shows `॥४२१॥`.

## Adding New Source Texts

When adding a new source text:

1. **Naming convention**: `<collection-name>-<source>.txt`
   - Examples: `hanuman-chalisa-sacred-texts.txt`, `sundar-kaand-gita-press.txt`

2. **Include header** with:
   - Collection name
   - Source URL
   - Date retrieved
   - Any relevant notes about the edition

3. **Format**: Plain text, UTF-8 encoding, Devanagari script

4. **Update this README** with the new file details

## Parsing

To parse a source text into structured YAML:

```bash
python scripts/parse-sundar-kaand.py
```

The parser will:
1. Read from `data/sources/<collection>.txt`
2. Parse verses according to the collection's structure
3. Generate `data/verses/<collection>.yml`

## Quality Assurance

Before committing changes:
- [ ] Verify text accuracy against source
- [ ] Check Devanagari encoding (UTF-8)
- [ ] Ensure proper line breaks and verse structure
- [ ] Document any variants or editorial decisions
- [ ] Test parsing to structured YAML format

## Sources

- **Wikipedia**: Community-edited, generally reliable for popular texts
- **Gita Press**: Traditional publisher, authoritative editions
- **Sacred-Texts.com**: Digital library of religious texts
- **IGNCA**: Indira Gandhi National Centre for the Arts, scholarly editions
