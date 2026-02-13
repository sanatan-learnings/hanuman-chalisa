# Claude Skills

This directory contains Claude Code skills for automating workflows in the Hanuman GPT project.

## Available Skills

### verse-generator

Automates the complete verse creation workflow:
- Creates verse markdown files with full content
- Adds scene descriptions for image generation
- Generates multimedia using verse-content-sdk (images + audio)
- Updates embeddings for search functionality
- Manages navigation links between verses
- Helps with git commits

**Usage**: `/verse-generator`

See [verse-generator/README.md](verse-generator/README.md) for detailed documentation.

## Installing Skills

To use these skills as slash commands in Claude Code, you need to link or copy them to `~/.claude/skills/`:

```bash
# Create symlinks (recommended - stays in sync with project)
mkdir -p ~/.claude/skills
ln -s "$(pwd)/.claude/skills/verse-generator" ~/.claude/skills/verse-generator

# Or copy (one-time install)
cp -r .claude/skills/verse-generator ~/.claude/skills/
```

## Creating New Skills

To create a new skill:

1. Create a directory under `.claude/skills/` with your skill name
2. Add required files:
   - `SKILL.md` - Markdown file with YAML frontmatter (name, description, instructions)
   - `README.md` - User documentation (optional)

Example structure:
```
.claude/skills/
└── my-skill/
    ├── SKILL.md      # Required: YAML frontmatter + markdown instructions
    └── README.md     # Optional: documentation
```

See [verse-generator](verse-generator/) as a reference implementation.

## skill.json Format

```json
{
  "name": "skill-name",
  "version": "1.0.0",
  "description": "Brief description of what the skill does",
  "author": "Your Name",
  "entrypoint": "instructions.md"
}
```

## Documentation

- [Claude Code Skills Documentation](https://docs.anthropic.com/claude/docs/claude-code-skills)
- [verse-content-sdk](https://github.com/sanatan-learnings/verse-content-sdk)

## Contributing

When creating new skills:
1. Follow the existing structure and naming conventions
2. Write clear, detailed instructions in `instructions.md`
3. Include comprehensive examples
4. Document prerequisites and error handling
5. Add cost estimates for API-using skills
6. Test thoroughly before committing

## License

MIT
