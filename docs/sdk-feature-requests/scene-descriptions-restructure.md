# Feature Request: Support data/scenes/ for Scene Descriptions

## Overview

Update `verse-generate` to read scene descriptions from the new structured location `data/scenes/{collection}.yml` (YAML format) instead of `docs/image-prompts/{collection}.md` (Markdown format).

This aligns with better project organization where all **source data** lives in `data/` and all **generated output** lives in root directories.

---

## Current Behavior

**Location:** `docs/image-prompts/{collection}.md`
**Format:** Markdown

```markdown
### Verse 1 (verse_01): Ocean of Knowledge and Virtues

**Scene Description**:
Hanuman standing in a majestic pose, radiating divine light that
illuminates all three realms - heaven, earth, and the netherworld...

---

### Verse 2 (verse_02): Rama's Messenger

**Scene Description**:
Hanuman in dynamic motion - flying or leaping across the sky...
```

**Issues:**
- ❌ Lives under `docs/` but is actually **input data**, not documentation
- ❌ Markdown format requires parsing and is harder to work with programmatically
- ❌ Doesn't align with other source data (`data/verses/{collection}.yml`)
- ❌ Not clear this is source vs generated content

---

## Requested Behavior

**New Location:** `data/scenes/{collection}.yml`
**New Format:** YAML (structured data)

```yaml
_meta:
  collection: hanuman-chalisa
  source: Original scene descriptions
  description: Scene descriptions for image generation
  format: theme-agnostic scene descriptions

scenes:
  verse-01:
    title: "Ocean of Knowledge and Virtues"
    description: |
      Hanuman standing in a majestic pose, radiating divine light that
      illuminates all three realms - heaven, earth, and the netherworld.
      The three worlds can be shown as cosmic layers or spheres. Hanuman
      is the source of illumination, representing his boundless knowledge
      and virtues spreading throughout the universe. His presence brings
      enlightenment to all beings.

  verse-02:
    title: "Rama's Messenger"
    description: |
      Hanuman in dynamic motion - flying or leaping across the sky with
      incredible speed. He carries Rama's message (can be shown as a ring,
      scroll, or divine light). Wind swirls around him showing his swift
      movement. His expression shows determination and devotion to his
      mission. The sky and clouds rush past, emphasizing speed and purpose.

  chaupai-01:
    title: "Jambavan's Inspiring Words"
    description: |
      Jambavan, the wise ancient bear king with white fur and divine
      presence, speaking inspiring words to Hanuman on a mountain peak...

  title-page:
    title: "Title Page"
    description: |
      Welcoming title composition featuring Lord Hanuman in a central,
      prominent position with an inviting gesture...
```

---

## Benefits

### For SDK
- ✅ **Easier parsing**: YAML is structured, no regex needed
- ✅ **Type safety**: Can validate schema
- ✅ **Metadata support**: Store collection info, source, format in `_meta`
- ✅ **Consistent**: Same format as `data/verses/{collection}.yml`
- ✅ **Better error messages**: YAML parsing errors are clear

### For Projects
- ✅ **Logical organization**: All source data in `data/`
- ✅ **Clear separation**: Source (`data/`) vs Generated (`images/`, `audio/`, `_verses/`)
- ✅ **Parallel structure**: `data/verses/` + `data/scenes/`
- ✅ **Intuitive**: "Where are scene descriptions?" → "In `data/` with other sources"
- ✅ **Programmatic access**: Easy to read, validate, transform

---

## Implementation Details

### 1. Update Scene Description Loader

**Current code** (pseudocode):
```python
def load_scene_description(collection, verse_id):
    md_file = f"docs/image-prompts/{collection}.md"
    content = read_file(md_file)

    # Parse Markdown with regex
    pattern = rf"### .*\({verse_id}\):.*?\*\*Scene Description\*\*:(.*?)---"
    match = re.search(pattern, content, re.DOTALL)

    if match:
        return match.group(1).strip()
    else:
        return None  # Scene not found
```

**Requested code**:
```python
def load_scene_description(collection, verse_id):
    # Try new location first (YAML)
    yaml_file = f"data/scenes/{collection}.yml"
    if os.path.exists(yaml_file):
        data = yaml.safe_load(open(yaml_file))
        scenes = data.get('scenes', {})
        scene = scenes.get(verse_id)

        if scene:
            return scene['description']

    # Fallback to old location (Markdown) for backward compatibility
    md_file = f"docs/image-prompts/{collection}.md"
    if os.path.exists(md_file):
        content = read_file(md_file)
        pattern = rf"### .*\({verse_id}\):.*?\*\*Scene Description\*\*:(.*?)---"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            return match.group(1).strip()

    # Not found in either location
    return None
```

### 2. Configuration Option

Allow users to configure scene description location:

**In `data/themes/{collection}/modern-minimalist.yml`:**
```yaml
scene_descriptions:
  source: data/scenes  # or "docs/image-prompts" for legacy
  format: yaml         # or "markdown"
```

Or via CLI flag:
```bash
verse-generate --scene-source data/scenes --scene-format yaml
```

### 3. Validation

Add schema validation for YAML scene files:

```python
SCENE_SCHEMA = {
    '_meta': {
        'required': True,
        'fields': ['collection', 'description', 'format']
    },
    'scenes': {
        'required': True,
        'type': 'dict',
        'item_schema': {
            'title': {'required': True, 'type': 'str'},
            'description': {'required': True, 'type': 'str'}
        }
    }
}

def validate_scene_file(yaml_data):
    """Validate scene YAML against schema."""
    # Check _meta exists
    if '_meta' not in yaml_data:
        raise ValidationError("Missing _meta section")

    # Check scenes exists
    if 'scenes' not in yaml_data:
        raise ValidationError("Missing scenes section")

    # Validate each scene
    for verse_id, scene in yaml_data['scenes'].items():
        if 'title' not in scene:
            raise ValidationError(f"Scene {verse_id}: missing 'title'")
        if 'description' not in scene:
            raise ValidationError(f"Scene {verse_id}: missing 'description'")

    return True
```

### 4. Better Error Messages

**When scene not found:**
```
✗ Scene description not found

  Collection: hanuman-chalisa
  Verse: verse-05

  Checked locations:
    1. data/scenes/hanuman-chalisa.yml (YAML format)
       Status: File exists
       Issue: Verse 'verse-05' not found in scenes

    2. docs/image-prompts/hanuman-chalisa.md (Markdown - legacy)
       Status: File not found

  Available scenes in YAML file:
    - title-page
    - verse-01
    - verse-02
    - verse-03
    - verse-04
    - verse-06  ← verse-05 is missing!
    - verse-07
    ...

  Fix: Add verse-05 to data/scenes/hanuman-chalisa.yml

  Format:
    verse-05:
      title: "Your Scene Title"
      description: |
        Your detailed scene description here...
```

### 5. Auto-Generate Scene Description (If Missing)

When `--auto-generate-scene` flag is used and scene is missing:

```python
def auto_generate_scene(collection, verse_id, devanagari_text):
    """Generate scene description using AI."""

    prompt = f"""Generate a detailed scene description for image generation.

Collection: {collection}
Verse: {verse_id}
Devanagari Text: {devanagari_text}

Requirements:
- Describe what's happening (action, characters, setting)
- Include spiritual significance
- Be theme-agnostic (no visual style)
- 50-150 words
- Present tense

Example format:
"Hanuman standing on a mountain peak, looking toward Lanka with
determination. His orange-red form radiates divine energy. Sacred
symbols surround him. The vast ocean stretches below..."

Generate scene description:"""

    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content.strip()


def save_generated_scene(collection, verse_id, title, description):
    """Save auto-generated scene to YAML file."""

    yaml_file = f"data/scenes/{collection}.yml"

    # Load existing data
    if os.path.exists(yaml_file):
        with open(yaml_file) as f:
            data = yaml.safe_load(f)
    else:
        data = {
            '_meta': {
                'collection': collection,
                'description': f'Scene descriptions for {collection}',
                'format': 'theme-agnostic scene descriptions'
            },
            'scenes': {}
        }

    # Add new scene
    data['scenes'][verse_id] = {
        'title': title,
        'description': description
    }

    # Write back
    with open(yaml_file, 'w') as f:
        yaml.dump(data, f, default_flow_style=False,
                 allow_unicode=True, sort_keys=False)

    print(f"✓ Auto-generated scene for {verse_id}")
    print(f"  Saved to: {yaml_file}")
    print(f"  → Review and edit as needed")
```

---

## Migration Path

### Phase 1: Support Both Formats (Backward Compatible)

```bash
# SDK checks both locations (new YAML first, fallback to old Markdown)
verse-generate --collection hanuman-chalisa --verse 1
```

**Behavior:**
1. Check `data/scenes/hanuman-chalisa.yml` → scenes.verse-01
2. If not found, check `docs/image-prompts/hanuman-chalisa.md`
3. If not found, error (or auto-generate if flag set)

### Phase 2: Deprecation Warning (6 months)

```bash
verse-generate --collection hanuman-chalisa --verse 1
```

**Output:**
```
⚠️  DEPRECATION WARNING

  Scene descriptions loaded from legacy location:
    docs/image-prompts/hanuman-chalisa.md

  Please migrate to new format:
    data/scenes/hanuman-chalisa.yml

  Use: verse-migrate-scenes --collection hanuman-chalisa

  Legacy support will be removed in SDK 0.20.0 (Jan 2027)
```

### Phase 3: Remove Legacy Support (12+ months)

SDK only reads from `data/scenes/*.yml`.

---

## Conversion Tool

Provide migration tool in SDK:

```bash
verse-migrate-scenes --collection hanuman-chalisa

# Or migrate all
verse-migrate-scenes --all
```

**What it does:**
1. Read `docs/image-prompts/{collection}.md`
2. Parse Markdown scene descriptions
3. Convert to YAML format
4. Write to `data/scenes/{collection}.yml`
5. Validate output
6. Optionally archive old files

**Example output:**
```
Migrating scene descriptions for hanuman-chalisa...

✓ Read docs/image-prompts/hanuman-chalisa.md
✓ Parsed 43 scene descriptions
✓ Converted to YAML format
✓ Validated output
✓ Wrote data/scenes/hanuman-chalisa.yml

Next steps:
  1. Review: data/scenes/hanuman-chalisa.yml
  2. Test: verse-generate --collection hanuman-chalisa --verse 1 --image
  3. Archive old file: mv docs/image-prompts/hanuman-chalisa.md docs/image-prompts.old/
```

---

## Testing

### Unit Tests

```python
def test_load_scene_from_yaml():
    """Test loading scene from new YAML format."""
    scene = load_scene_description('hanuman-chalisa', 'verse-01')
    assert scene is not None
    assert 'Hanuman standing' in scene
    assert len(scene) > 50

def test_fallback_to_markdown():
    """Test fallback to legacy Markdown format."""
    # Remove YAML file temporarily
    os.rename('data/scenes/test.yml', 'data/scenes/test.yml.bak')

    scene = load_scene_description('test', 'verse-01')
    assert scene is not None  # Should load from Markdown

    # Restore
    os.rename('data/scenes/test.yml.bak', 'data/scenes/test.yml')

def test_scene_not_found_error():
    """Test error message when scene not found."""
    with pytest.raises(SceneNotFoundError) as exc:
        load_scene_description('hanuman-chalisa', 'verse-999')

    assert 'verse-999' in str(exc.value)
    assert 'data/scenes/hanuman-chalisa.yml' in str(exc.value)
```

### Integration Tests

```bash
# Test with new YAML format
verse-generate --collection hanuman-chalisa --verse 1 --image

# Test backward compatibility
mv data/scenes/hanuman-chalisa.yml data/scenes/hanuman-chalisa.yml.bak
verse-generate --collection hanuman-chalisa --verse 1 --image  # Should still work with Markdown
mv data/scenes/hanuman-chalisa.yml.bak data/scenes/hanuman-chalisa.yml
```

---

## Configuration Examples

### Project-Level Config

**`sanatan-sdk.yml`** (new file):
```yaml
scene_descriptions:
  source_dir: data/scenes
  format: yaml
  fallback: true  # Enable backward compatibility with Markdown
  auto_generate: false  # Don't auto-generate missing scenes

collections:
  hanuman-chalisa:
    scene_source: data/scenes/hanuman-chalisa.yml
  sundar-kaand:
    scene_source: data/scenes/sundar-kaand.yml
```

### CLI Flags

```bash
# Use YAML format (default)
verse-generate --scene-format yaml

# Force Markdown format (legacy)
verse-generate --scene-format markdown

# Custom location
verse-generate --scene-source custom/path/scenes.yml

# Auto-generate if missing
verse-generate --auto-generate-scene
```

---

## Impact Analysis

### Breaking Changes
- **None** if backward compatibility is maintained
- Projects can migrate at their own pace

### Benefits
- ✅ Better organization (source data in `data/`)
- ✅ Easier parsing (YAML vs regex on Markdown)
- ✅ Better error messages
- ✅ Schema validation
- ✅ Consistent with `data/verses/*.yml`

### Migration Effort
- **SDK**: 1-2 days (add YAML loader, maintain backward compat, add migration tool)
- **Projects**: 5 minutes (run `verse-migrate-scenes --all`)

---

## Example: hanuman-gpt Project

### Before (Legacy)
```
hanuman-gpt/
├── docs/image-prompts/
│   ├── hanuman-chalisa.md      ❌ Under docs/ but is input data
│   └── sundar-kaand.md
└── data/verses/
    ├── hanuman-chalisa.yml     ✅ Source data
    └── sundar-kaand.yml
```

### After (New Structure)
```
hanuman-gpt/
└── data/
    ├── verses/
    │   ├── hanuman-chalisa.yml  ✅ Source: Canonical text
    │   └── sundar-kaand.yml
    └── scenes/
        ├── hanuman-chalisa.yml  ✅ Source: Scene descriptions
        └── sundar-kaand.yml
```

**Clearer separation:**
- `data/` = Source (input)
- `audio/`, `images/`, `_verses/` = Generated (output)

---

## Related Issues

This feature request relates to:
1. Navigation link fixes (use sequence from YAML)
2. Scene description source priority (respect existing vs auto-generate)
3. Pre-generation validation (check scene exists)

---

## Summary

**Request:** Support `data/scenes/{collection}.yml` (YAML) for scene descriptions

**Priority:** 🟡 **MEDIUM** (Nice to have, improves organization)

**Implementation:**
1. Add YAML scene loader
2. Maintain backward compatibility with Markdown
3. Add migration tool (`verse-migrate-scenes`)
4. Update documentation
5. Add validation and better error messages

**Timeline:**
- Phase 1 (Immediate): Support both formats
- Phase 2 (6 months): Deprecation warning
- Phase 3 (12 months): Remove legacy support

**Impact:** Better project organization, easier parsing, consistent structure

---

**Reference Implementation:** See `hanuman-gpt` project commit `ecaaa7d` for example migration and YAML format.
