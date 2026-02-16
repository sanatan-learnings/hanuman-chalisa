# GitHub Issue for sanatan-sdk

**Copy this content when creating the issue:**

---

## Title
Support `data/scenes/*.yml` for scene descriptions (structured YAML format)

## Labels
`enhancement`, `breaking-change` (future), `documentation`

## Description

### Problem

Scene descriptions currently live in `docs/image-prompts/{collection}.md` (Markdown format), which:
- ❌ Is non-intuitive (under `docs/` but is actually input data)
- ❌ Requires regex parsing (error-prone)
- ❌ Doesn't align with other source files (`data/verses/*.yml`)
- ❌ Makes programmatic access difficult

### Proposed Solution

Support reading scene descriptions from `data/scenes/{collection}.yml` (YAML format):

```yaml
_meta:
  collection: hanuman-chalisa
  description: Scene descriptions for image generation
  format: theme-agnostic scene descriptions

scenes:
  verse-01:
    title: "Ocean of Knowledge and Virtues"
    description: |
      Hanuman standing in a majestic pose, radiating divine light that
      illuminates all three realms - heaven, earth, and the netherworld...

  verse-02:
    title: "Rama's Messenger"
    description: |
      Hanuman in dynamic motion - flying or leaping across the sky...
```

### Benefits

**For SDK:**
- ✅ Easier parsing (YAML vs regex on Markdown)
- ✅ Schema validation
- ✅ Better error messages
- ✅ Consistent with `data/verses/*.yml`

**For Projects:**
- ✅ All source data in `data/` (logical organization)
- ✅ Clear separation: Source (`data/`) vs Generated (`audio/`, `images/`, `_verses/`)
- ✅ Parallel structure: `data/verses/` + `data/scenes/`
- ✅ Intuitive and discoverable

### Implementation

#### Phase 1: Support Both Formats (Backward Compatible)

```python
def load_scene_description(collection, verse_id):
    # 1. Try new location (YAML)
    yaml_file = f"data/scenes/{collection}.yml"
    if os.path.exists(yaml_file):
        data = yaml.safe_load(open(yaml_file))
        scene = data['scenes'].get(verse_id)
        if scene:
            return scene['description']

    # 2. Fallback to legacy (Markdown)
    md_file = f"docs/image-prompts/{collection}.md"
    if os.path.exists(md_file):
        # Parse Markdown with regex (existing code)
        ...

    return None
```

#### Phase 2: Migration Tool

```bash
verse-migrate-scenes --collection hanuman-chalisa
# Converts docs/image-prompts/*.md → data/scenes/*.yml
```

#### Phase 3: Deprecation (6+ months later)

Show warning when loading from legacy location:
```
⚠️  DEPRECATION WARNING
Scene descriptions loaded from legacy location: docs/image-prompts/
Migrate to: data/scenes/*.yml
Use: verse-migrate-scenes --collection hanuman-chalisa
```

#### Phase 4: Remove Legacy Support (12+ months later)

Only support `data/scenes/*.yml`.

### Required Changes

1. **Scene loader** - Support YAML format with fallback
2. **Migration tool** - `verse-migrate-scenes` command
3. **Validation** - Schema validation for YAML files
4. **Error messages** - Better errors when scene not found
5. **Documentation** - Update README and examples
6. **Tests** - Unit and integration tests

### Configuration

Allow configuration of scene source:

```yaml
# sanatan-sdk.yml
scene_descriptions:
  source_dir: data/scenes  # or docs/image-prompts
  format: yaml             # or markdown
  fallback: true           # Enable backward compat
```

CLI flags:
```bash
verse-generate --scene-format yaml
verse-generate --scene-source custom/path/scenes.yml
```

### Reference Implementation

See **hanuman-gpt** project:
- Commit: [`ecaaa7d`](https://github.com/sanatan-learnings/hanuman-gpt/commit/ecaaa7d)
- Conversion script: `scripts/convert_scenes_to_yaml.py`
- Example YAML: `data/scenes/hanuman-chalisa.yml`
- Full spec: `docs/sdk-feature-requests/scene-descriptions-restructure.md`

### Breaking Changes

**None** if backward compatibility is maintained properly.

Projects can migrate at their own pace:
1. SDK supports both formats
2. Projects migrate when ready
3. Deprecation warning after 6 months
4. Legacy removal after 12+ months

### Testing Checklist

- [ ] Load scenes from YAML format
- [ ] Fallback to Markdown (legacy)
- [ ] Scene not found - clear error message
- [ ] List available scenes in error
- [ ] Migration tool works correctly
- [ ] Validate YAML schema
- [ ] CLI flags work (`--scene-format`, `--scene-source`)
- [ ] Configuration file support
- [ ] Integration tests with `verse-generate`

### Priority

🟡 **MEDIUM** - Improves organization and developer experience, not critical for functionality

### Effort Estimate

- **Development**: 1-2 days
- **Testing**: 0.5 day
- **Documentation**: 0.5 day
- **Total**: 2-3 days

### Related Issues

This complements:
- Navigation link fixes (#TBD)
- Scene description validation (#TBD)
- Pre-generation checks (#TBD)

---

## Additional Context

**Project structure comparison:**

Before:
```
docs/image-prompts/hanuman-chalisa.md   ❌ Unclear location
data/verses/hanuman-chalisa.yml         ✅ Clear (canonical text)
```

After:
```
data/
  ├── verses/hanuman-chalisa.yml        ✅ Source: Canonical text
  └── scenes/hanuman-chalisa.yml        ✅ Source: Scene descriptions
```

**Full specification:** See [scene-descriptions-restructure.md](https://github.com/sanatan-learnings/hanuman-gpt/blob/main/docs/sdk-feature-requests/scene-descriptions-restructure.md) for complete implementation details, code examples, migration path, and testing strategy.

---

## Acceptance Criteria

- [x] SDK reads scenes from `data/scenes/{collection}.yml`
- [x] YAML format with `_meta` and `scenes` sections
- [x] Backward compatibility with `docs/image-prompts/*.md`
- [x] Migration tool: `verse-migrate-scenes`
- [x] Schema validation for YAML
- [x] Clear error messages when scene not found
- [x] Configuration support (file and CLI)
- [x] Documentation updated
- [x] Tests added (unit + integration)
- [x] Example project (hanuman-gpt) works with both formats
