#!/usr/bin/env python3
"""
Parse Sundar Kaand text from source and generate canonical YAML.

Format:
- Opening: 3 shlokas (4 lines each)
- Body: Alternating chaupais (single lines with ॥) and dohas (marked with "दोहा")
- Each chaupai is ONE line with two parts separated by । and ending with ॥
- Chaupais are NOT explicitly marked, dohas ARE marked
"""

import re
import yaml


def clean_verse_line(line: str) -> str:
    """Remove verse numbering like ॥१॥"""
    line = re.sub(r'॥\d+[क-ख]?॥\s*$', '', line)
    return line.strip()


def parse_sundar_kaand(input_file: str, output_file: str):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [l.rstrip() for l in f.readlines()]

    verses = []
    i = 0

    # Find "श्लोक" header
    while i < len(lines) and lines[i].strip() != 'श्लोक':
        i += 1
    i += 1  # Skip the "श्लोक" line

    # Parse 3 shlokas (4 lines each)
    for shloka_num in range(1, 4):
        verse_lines = []
        while len(verse_lines) < 4 and i < len(lines):
            l = lines[i].strip()
            if l:
                verse_lines.append(clean_verse_line(l))
            i += 1

        verses.append({
            'verse_id': f'shloka_{shloka_num:02d}',
            'devanagari': '\n'.join(verse_lines),
            'notes': f"Opening shloka {shloka_num}"
        })

    print(f"✅ Parsed 3 shlokas")

    # Now parse chaupais and dohas
    chaupai_count = 0
    doha_count = 0
    soratha_count = 0

    while i < len(lines):
        line = lines[i].strip()

        # Skip empty lines and end markers
        if not line or 'इति श्री' in line or 'मासपारायण' in line or '(सुन्दरकाण्ड' in line:
            i += 1
            continue

        # Skip छंद sections (supplementary verses)
        if line.startswith('छं=') or line.startswith('छंद'):
            i += 1
            # Skip until next doha/soratha or regular chaupai
            while i < len(lines):
                l = lines[i].strip()
                if l.startswith(('दोहा', 'दो०', 'सोरठा')):
                    break
                # Back to regular verses
                if l and '।।' in l and not '॥' in l:
                    break
                i += 1
            continue

        # Check for doha marker (can have text on same line)
        if line.startswith('दोहा') or line.startswith('दो०'):
            verse_lines = []

            # Check if doha text is on the same line as marker
            # Format: "दोहा- <text>।" or "दो०=<text>।"
            doha_match = re.match(r'^(?:दोहा|दो०)[-=]?\s*(.+)$', line)
            if doha_match:
                first_line = clean_verse_line(doha_match.group(1))
                if first_line:
                    verse_lines.append(first_line)

            # Collect remaining doha lines
            i += 1
            while i < len(lines) and len(verse_lines) < 2:
                l = lines[i].strip()
                if l and ('।' in l or '॥' in l):
                    verse_lines.append(clean_verse_line(l))
                    i += 1
                    # Dohas usually end with ॥
                    if '॥' in l:
                        break
                elif not l:
                    i += 1
                    break
                else:
                    i += 1

            if verse_lines:
                doha_count += 1
                verses.append({
                    'verse_id': f'doha_{doha_count:02d}',
                    'devanagari': '\n'.join(verse_lines),
                    'notes': f"Doha {doha_count}"
                })
            continue

        # Soratha
        if line.startswith('सोरठा'):
            verse_lines = []
            soratha_match = re.match(r'^सोरठा[-=]?\s*(.+)$', line)
            if soratha_match:
                first_line = clean_verse_line(soratha_match.group(1))
                if first_line:
                    verse_lines.append(first_line)

            i += 1
            while i < len(lines) and len(verse_lines) < 3:
                l = lines[i].strip()
                if l and ('।' in l or '॥' in l):
                    verse_lines.append(clean_verse_line(l))
                    i += 1
                    if '॥' in l:
                        break
                elif not l:
                    break
                else:
                    i += 1

            if verse_lines:
                soratha_count += 1
                verses.append({
                    'verse_id': f'soratha_{soratha_count:02d}',
                    'devanagari': '\n'.join(verse_lines),
                    'notes': f"Soratha {soratha_count}"
                })
            continue

        # Regular chaupai: single line ending with ॥
        # Each chaupai is ONE line with two parts separated by ।
        # (NOT marked with any special header)
        if '॥' in line and not line.startswith(('दोहा', 'दो०', 'सोरठा', 'छं')):
            chaupai_text = clean_verse_line(line)

            chaupai_count += 1
            verses.append({
                'verse_id': f'chaupai_{chaupai_count:02d}',
                'devanagari': chaupai_text,
                'notes': f"Chaupai {chaupai_count}"
            })
            i += 1
            continue

        i += 1

    # Build sequence array and dictionary structure
    sequence = [v['verse_id'] for v in verses]

    # Create dictionary with _meta and verse entries
    output_data = {
        '_meta': {
            'collection': 'sundar-kaand',
            'source': 'https://hi.wikipedia.org/wiki/%E0%A4%B8%E0%A5%81%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1',
            'description': 'Sundar Kaand from Ramcharitmanas by Goswami Tulsidas',
            'note': 'DISCREPANCY: Traditional Ramcharitmanas has 524 chaupais + 60 dohas. This Wikipedia source has 522 chaupais + 58 dohas. See Issue #14.',
            'sequence': sequence
        }
    }

    # Add each verse as a top-level key
    for verse in verses:
        verse_id = verse['verse_id']
        output_data[verse_id] = {
            'devanagari': verse['devanagari']
        }

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Sundar Kaand - Canonical Verse Texts\n")
        f.write("# Parsed from Wikipedia definitive source\n")
        f.write("# Structure: 3 opening shlokas, then alternating chaupais and dohas (~60 sets)\n\n")
        yaml.dump(output_data, f, allow_unicode=True, sort_keys=False, default_flow_style=False, width=1000)

    print(f"\n✅ Success! Parsed {len(verses)} verses:")
    print(f"   📿 3 shlokas")
    print(f"   🕉️  {chaupai_count} chaupais")
    print(f"   📜 {doha_count} dohas")
    print(f"   ✨ {soratha_count} sorathas")
    print(f"\n📝 Output: {output_file}")

    # Show samples
    print("\n📋 First few chaupais:")
    chaupai_samples = [v for v in verses if v['verse_id'].startswith('chaupai_')][:5]
    for v in chaupai_samples:
        preview = v['devanagari'].replace('\n', ' ')[:70]
        print(f"  {v['verse_id']}: {preview}...")


if __name__ == "__main__":
    input_file = "data/source-texts/sundar-kaand-wikipedia.txt"
    output_file = "data/verses/sundar-kaand.yml"

    print(f"📖 Parsing Sundar Kaand from {input_file}...\n")
    parse_sundar_kaand(input_file, output_file)
