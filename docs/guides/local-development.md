# Local Development Setup

This guide helps you set up a local Jekyll environment to test changes before pushing to GitHub Pages.

## Why Local Development?

- **Faster iteration**: See changes immediately without waiting for GitHub Actions
- **Catch errors early**: Jekyll will show build errors locally before you push
- **Offline work**: Develop without internet connection

## Prerequisites

- macOS (you have this)
- Homebrew (you have this)

## Setup Steps

### 1. Install rbenv (Ruby Version Manager)

```bash
brew install rbenv ruby-build
```

### 2. Initialize rbenv in your shell

Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc
source ~/.zshrc
```

Or for bash:

```bash
echo 'eval "$(rbenv init - bash)"' >> ~/.bash_profile
source ~/.bash_profile
```

### 3. Install Ruby 3.3.0

```bash
rbenv install 3.3.0
rbenv global 3.3.0
ruby -v  # Should show ruby 3.3.0
```

### 4. Install Bundler

```bash
gem install bundler
```

### 5. Install Jekyll Dependencies

```bash
cd ~/workspaces/hanuman-gpt
bundle install
```

### 6. Set Up Python Virtual Environment

For content generation (images, audio, embeddings), set up a Python virtual environment:

```bash
# Install Python 3 (if not already installed)
brew install python3

# Create virtual environment
cd ~/workspaces/hanuman-gpt
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install sanatan-sdk
pip install sanatan-sdk

# Verify installation
verse-images --help
```

**Important:** Always activate the venv before running SDK commands:

```bash
# Activate venv (run this each time you open a new terminal)
source venv/bin/activate

# Now you can use SDK commands
verse-images --theme-name modern-minimalist
verse-audio
verse-embeddings
```

**To deactivate:**

```bash
deactivate
```

### 7. Enable verse-generator Claude Skill (Optional)

For automated verse creation workflow, enable the Claude Code skill:

```bash
mkdir -p ~/.claude/skills
ln -s "$(pwd)/.claude/skills/verse-generator" ~/.claude/skills/verse-generator
```

Use with `/verse-generator` command in Claude Code. See [Content Generation Guide](content-generation.md#automated-verse-creation-with-claude-skill) for details.

## Running the Local Server

### Start Jekyll Server

```bash
bundle exec jekyll serve
```

This will:
- Build your site
- Start a local web server at http://localhost:4000/hanuman-gpt/
- Watch for file changes and rebuild automatically

### Common Options

```bash
# Serve with drafts
bundle exec jekyll serve --drafts

# Serve on a different port
bundle exec jekyll serve --port 4001

# Verbose output for debugging
bundle exec jekyll serve --verbose

# Incremental builds (faster)
bundle exec jekyll serve --incremental
```

## Testing Your Changes

1. **Start the server**: `bundle exec jekyll serve`
2. **Open browser**: http://localhost:4000/hanuman-gpt/
3. **Make changes**: Edit files in your editor
4. **Refresh browser**: Jekyll auto-rebuilds (wait a few seconds)
5. **Check console**: Look for build errors in the terminal

## Common Build Errors

### Liquid Syntax Error

```
Liquid Exception: Liquid syntax error
```

**Fix:** Check your Liquid template tags (percent-brace and double-brace syntax) in templates. Wrap example code in raw/endraw tags to prevent Jekyll from processing it.

### YAML Parsing Error

```
YAML Exception reading file
```

**Fix:** Check verse files for:
- Proper indentation (2 spaces)
- Quoted strings with nested quotes need `|` block scalar notation
- No tabs (use spaces only)

### Missing Translation Key

```
Liquid error: undefined method
```

**Fix:** Check `_data/translations/*.yml` has all required keys.

## Validating Changes

Before committing:

```bash
# Build without serving (faster error checking)
bundle exec jekyll build

# Check for broken links
# (add this after implementing)

# Validate YAML in verse files
ruby -ryaml -e "Dir.glob('_verses/*.md').each { |f| YAML.load(File.read(f).split('---')[1]) }"
```

## Troubleshooting

### Port Already in Use

```bash
# Kill existing Jekyll process
lsof -ti:4000 | xargs kill -9

# Or use different port
bundle exec jekyll serve --port 4001
```

### Bundle Install Fails

```bash
# Update bundler
gem install bundler

# Clean and reinstall
rm -rf vendor/bundle
bundle install
```

### Changes Not Showing Up

```bash
# Clean Jekyll cache
bundle exec jekyll clean

# Rebuild
bundle exec jekyll build

# Hard refresh browser: Cmd+Shift+R (macOS)
```

### Ruby Version Issues

```bash
# Check current Ruby version
ruby -v

# Should be 3.3.0 or higher
# If not, check rbenv:
rbenv versions
rbenv global 3.3.0
```

## Workflow

### Making Changes

1. **Edit files** in your editor
2. **Check terminal** for build errors
3. **Refresh browser** to see changes
4. **Test thoroughly**:
   - Navigate through verses
   - Test language switcher
   - Check search functionality
   - Test print layout
5. **Commit** when everything works

### Adding New Content

```bash
# Copy existing verse as template
cp _verses/verse_01.md _verses/verse_NEW.md

# Edit the new file
# Check it builds: bundle exec jekyll build
# View it locally: http://localhost:4000/hanuman-gpt/verses/verse_NEW/
```

## Performance Tips

- Use `--incremental` for faster rebuilds during development
- Use `--limit_posts 5` to build fewer items when testing layout changes
- Clean build artifacts periodically: `bundle exec jekyll clean`

## Pre-Commit Validation

The project includes a Git pre-commit hook that automatically validates your changes before each commit.

### What the Hook Does

The pre-commit hook automatically:
- ✅ Validates YAML syntax in all verse files
- ✅ Runs Jekyll build to catch errors
- ✅ Checks for common issues (unescaped Liquid syntax, etc.)
- ✅ Prevents broken commits from reaching GitHub

### Hook is Already Installed

The pre-commit hook is located at `.git/hooks/pre-commit` and is active.

### Using the Hook

The hook runs automatically on every commit:

```bash
# Make your changes
git add .

# Hook runs automatically during commit
git commit -m "Your message"
```

If validation fails, you'll see the specific errors and the commit will be blocked.

### Skipping the Hook (Not Recommended)

In rare cases, you can skip validation:

```bash
git commit --no-verify -m "Your message"
```

**Warning:** Only skip if you're certain the changes are safe!

### Example Output

When you commit, you'll see:

```
🙏 Pre-commit validation starting...
✓ Ruby version OK
✓ All verse files have valid YAML
✓ Jekyll build successful
✓ All pre-commit checks passed! ✨
📤 Proceeding with commit...
```

## Related Documentation

- **Project architecture**: [tech-stack.md](tech-stack.md)
- **Spiritual Guidance API**: [spiritual-guidance.md](../reference/spiritual-guidance.md), [cloudflare-worker-setup.md](cloudflare-worker-setup.md)
- **Developer guide**: [guide.md](guide.md)
- **YAML structure**: [tech-stack.md](../reference/tech-stack.md) (see Content Architecture section)

---

**Happy Developing!** 🙏
