# Theme Specifications

This directory contains comprehensive theme specifications for the Hanuman Chalisa project. Each theme has a detailed YAML specification that documents its visual style, design principles, and implementation guidelines.

## Purpose

Theme specification files serve as:
- **Design Documentation**: Complete visual style guides for each theme
- **Reference for Artists**: Guidelines for creating new images in the theme
- **Quality Assurance**: Standards for maintaining visual consistency
- **Historical Record**: Documentation of design decisions and intent

## Current Themes

### Modern Minimalist
**File**: `modern-minimalist.yml`

Contemporary spiritual aesthetic featuring:
- Saffron orange and golden color palette
- Luminous, radiant depictions with dramatic lighting
- Clean, minimalist composition with detailed ornamentation
- Generated using DALL-E 3

## File Structure

Each theme specification includes:

### Identity & Metadata
- Theme ID, version, creation date
- Generator/creation method
- Names in multiple languages

### Visual Style
- Aesthetic description and influences
- Color palette with hex codes and spiritual significance
- Lighting and atmospheric guidelines
- Pattern and ornamentation rules

### Depiction Rules
- How to depict Hanuman and other deities
- Attributes, expressions, and poses
- Cultural authenticity guidelines
- Symbolic elements and their meanings

### Technical Specifications
- Image dimensions and format requirements
- File organization and naming conventions
- Generation parameters and tools used

### Usage Guidelines
- Appropriate contexts for use
- Attribution requirements
- Modification policies

## Relationship to Other Files

### `_data/themes.yml`
- **Simple Jekyll configuration** used by the website
- Contains only: name, description, folder path, default status
- Consumed by Jekyll for theme switching functionality

### `data/themes/<collection-key>/*.yml`

Themes are organized by collection:
- **Comprehensive specifications** and design documentation
- Not processed by Jekyll - for human reference
- Detailed style guides, principles, and technical specs

### `docs/image-prompts.md`
- Base prompts for generating images
- Works across multiple themes with style modifiers
- Theme-agnostic core descriptions

## Adding New Themes

When creating a new theme:

1. Generate images using guidelines from `image-prompts.md`
2. Create a comprehensive YAML specification in this directory
3. Add a simple entry to `_data/themes.yml` for website functionality
4. Document the theme in `docs/adding-themes.md`

## Best Practices

- Keep specifications detailed but readable
- Include visual examples or references when possible
- Document the "why" behind design decisions
- Maintain cultural sensitivity and authenticity
- Update specifications as themes evolve

---

**Note**: Theme specifications are living documents. Update them when making significant changes to a theme's visual style or implementation.
