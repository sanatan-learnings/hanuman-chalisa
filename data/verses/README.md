# Structured Verse Files

This directory contains parsed, structured YAML files for verse collections.

## Collections

### sundar-kaand.yml
- **Source**: Wikipedia (parsed from `data/source-texts/sundar-kaand-wikipedia.txt`)
- **Parsed verses**: 584 total
  - 3 shlokas (opening invocations)
  - 522 chaupais (single lines ending with ॥)
  - 58 dohas (explicitly marked)
  - 1 soratha
- **Note**: 14 chhanda verses are in the source but currently not being parsed as a separate category

### ⚠️ Known Issue

**Traditional count discrepancy** - See [GitHub Issue #14](https://github.com/sanatan-learnings/hanuman-gpt/issues/14)

Traditional Ramcharitmanas: **524 chaupais + 60 dohas**
Our Wikipedia source: **522 chaupais + 58 dohas**
**Difference**: Missing 2 chaupais and 2 dohas

Investigation needed to determine if:
- Wikipedia source is incomplete
- Different counting methodology is used
- Chhanda verses should be counted differently

## Usage

Parse source texts:
```bash
python scripts/parse-sundar-kaand.py
```

Read verse data:
```python
import yaml
with open('data/verses/sundar-kaand.yml') as f:
    data = yaml.safe_load(f)
```
