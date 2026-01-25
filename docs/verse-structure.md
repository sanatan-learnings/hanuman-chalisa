# Verse Structure Guide

This document explains the YAML-based structure used for each verse in the Hanuman Chalisa guide.

## Architecture Overview

Each verse is stored as a markdown file with **YAML front matter only** (no markdown body). All content is structured as data, and the Jekyll template (`_layouts/verse.html`) handles all formatting and presentation.

**Benefits:**
- Change template once, affects all 43 verses
- Clean separation of data and presentation
- Easy to maintain and update
- Consistent formatting across all verses

## File Location

All verse files are in the `_verses/` directory (Jekyll collection):
- `_verses/doha_01.md`, `doha_02.md`
- `_verses/verse_01.md` through `verse_40.md`
- `_verses/doha_closing.md`

## YAML Structure

Each verse file contains only YAML front matter with the following fields:

```yaml
---
layout: verse
title: "Verse 1: Ocean of Knowledge and Virtues"
verse_number: 1
previous_verse: "/verses/doha_02"
next_verse: "/verses/verse_02"

devanagari: |
  जय हनुमान ज्ञान गुन सागर।
  जय कपीस तिहुं लोक उजागर।।

transliteration: |
  Jai Hanuman Gyaan gun saagar
  Jai Kapis Tihun lok ujagar

phonetic_notes:
  - word: "हनुमान"
    phonetic: "ha-nu-maan"
    emphasis: "last syllable"
  - word: "ज्ञान"
    phonetic: "gyaan"
    emphasis: "syllable"

word_meanings:
  - word: "जय"
    roman: "Jai"
    meaning: "victory/hail"
  - word: "हनुमान"
    roman: "Hanuman"
    meaning: "Lord Hanuman"
  - word: "ज्ञान"
    roman: "Gyan"
    meaning: "knowledge/wisdom"

literal_translation: "Hail Hanuman, ocean of knowledge and virtues. Hail the lord of monkeys, who illuminates the three worlds."

interpretive_meaning: "Hanuman is described as an ocean - limitless and deep in wisdom and virtues. The three worlds (heaven, earth, and the netherworld) represent all of existence, and Hanuman's divine presence brings light to all realms."

story: "Hanuman was blessed by various gods with knowledge and power. As a child, he mistook the sun for a fruit and tried to swallow it, demonstrating his fearlessness. Despite his monkey form, he mastered all scriptures and became a scholar."

practical_application:
  teaching: "True greatness combines knowledge and virtues, and divine wisdom illuminates all aspects of life without discrimination."
  when_to_use: "Recite this verse when seeking wisdom and enlightenment, or when you need to remember that learning and virtuous qualities are limitless like the ocean."
---
```

## Components Explained

### Required Fields

**`layout`** - Always set to `verse` (uses `_layouts/verse.html` template)

**`title`** - The verse title displayed as the page heading

**`verse_number`** - Used to generate image filename (`verse_01.jpg`)

**`previous_verse`** - URL path to previous verse for navigation

**`next_verse`** - URL path to next verse for navigation

### Content Fields

**`devanagari`** - Original Hindi text in Devanagari script (multiline with `|`)

**`transliteration`** - Simplified phonetic Roman script (not IAST standard)

**`phonetic_notes`** - Array of challenging words with pronunciation guidance:
- `word` - Devanagari word
- `phonetic` - Syllable breakdown
- `emphasis` - Which syllable to stress

**`word_meanings`** - Array of word-by-word translations:
- `word` - Devanagari word
- `roman` - Romanized version
- `meaning` - English translation

**`literal_translation`** - Direct, word-for-word English translation

**`interpretive_meaning`** - Flowing contextual translation capturing devotional spirit

**`story`** - Narrative context from Hanuman's life and Hindu mythology

**`practical_application`** - Modern relevance (object with two fields):
- `teaching` - Main lesson or value from the verse
- `when_to_use` - Life situations where this verse offers guidance

## How the Template Renders Content

The `_layouts/verse.html` template processes the YAML data:

| Section | YAML Field | Template Code |
|---------|-----------|---------------|
| Image | `verse_number` | `{{ '/images/verse_' \| append: verse_img \| append: '.jpg' }}` |
| Devanagari | `devanagari` | `{{ page.devanagari }}` |
| Transliteration | `transliteration` | `{{ page.transliteration }}` |
| Phonetic Notes | `phonetic_notes` | `{% for note in page.phonetic_notes %}` |
| Word Meanings | `word_meanings` | `{% for item in page.word_meanings %}` |
| Literal Translation | `literal_translation` | `{{ page.literal_translation }}` |
| Interpretive Meaning | `interpretive_meaning` | `{{ page.interpretive_meaning }}` |
| Story | `story` | `{{ page.story }}` |
| Practical Application | `practical_application` | `{{ page.practical_application.teaching }}` |

## Rendered Sections

When viewed on the website, each verse displays:

### **Verse Image**
Visual representation at the top (generated via DALL-E 3, in progress - 6 images added so far)

### **1. Original Hindi Text (Devanagari Script)**
The authentic verse in traditional form

### **2. Simplified Transliteration**
Phonetic Roman script for those unfamiliar with Devanagari

### **3. Pronunciation Guide**
- Audio recitation notice (coming soon via AI voice synthesis)
- Phonetic breakdown of challenging words
- Link to Comprehensive Guide for general tips

### **4. Word-by-Word Meaning**
Simple breakdown: Devanagari word (romanized) - English meaning

### **5. Literal Translation**
Direct word-for-word English translation

### **6. Interpretive Meaning**
Contextual translation capturing devotional essence

### **7. Story Behind the Verse**
Narrative context from Hanuman's life and mythology

### **9. Practical Application**
- **Key Teaching** - Main lesson from the verse
- **When to Use This Verse** - Life situations for guidance

## Editing Verses

To update content across all verses:

**Edit Template:** Modify `_layouts/verse.html` to change formatting for all 43 verses

**Edit Individual Verse:** Modify YAML in specific `_verses/*.md` file

**Add New Field:** Add to YAML in verses, then update template to display it

## Purpose of This Structure

1. **Maintainability** - Template changes affect all verses instantly
2. **Consistency** - All verses follow identical structure automatically
3. **Data Integrity** - YAML enforces proper structure
4. **Flexibility** - Easy to add new fields or change presentation
5. **Separation of Concerns** - Data (YAML) separate from presentation (template)

## Additional Resources

- See complete YAML example: `_verses/verse_01.md`
- Template implementation: `_layouts/verse.html`
- Technical details: [tech-stack.md](tech-stack.md)
