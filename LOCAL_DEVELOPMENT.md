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
cd ~/workspaces/hanuman-chalisa
bundle install
```

## Running the Local Server

### Start Jekyll Server

```bash
bundle exec jekyll serve
```

This will:
- Build your site
- Start a local web server at http://localhost:4000/hanuman-chalisa/
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
2. **Open browser**: http://localhost:4000/hanuman-chalisa/
3. **Make changes**: Edit files in your editor
4. **Refresh browser**: Jekyll auto-rebuilds (wait a few seconds)
5. **Check console**: Look for build errors in the terminal

## Common Build Errors

### Liquid Syntax Error

```
Liquid Exception: Liquid syntax error
```

**Fix:** Check your `{% %}` and `{{ }}` tags in templates. Use `{% raw %}{% endraw %}` for example code.

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

## Project Structure

```
hanuman-chalisa/
├── _config.yml           # Jekyll configuration
├── _layouts/             # Page templates
│   ├── default.html      # Base layout
│   └── verse.html        # Verse page layout
├── _verses/              # Verse content (YAML + Markdown)
│   ├── doha_01.md
│   ├── verse_01.md
│   └── ...
├── _data/                # Data files
│   └── translations/     # UI strings for i18n
│       ├── en.yml
│       └── hi.yml
├── assets/
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript
├── index.html            # Home page
├── search.html           # Search page
├── search.json           # Search data (generated)
└── Gemfile               # Ruby dependencies
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
# View it locally: http://localhost:4000/hanuman-chalisa/verses/verse_NEW/
```

## Performance Tips

- Use `--incremental` for faster rebuilds
- Limit `_verses/` directory while testing layout changes
- Use `--limit_posts 5` to build fewer items during testing

## Spiritual Guidance Feature (OpenAI Integration)

The spiritual guidance feature (`/guidance`) uses OpenAI's GPT-4 API for AI-powered Q&A about Hanuman Chalisa verses.

### Architecture

**Two Deployment Modes:**

1. **User-Provided API Key Mode** (Default for local development)
   - Users enter their own OpenAI API key
   - Key stored in browser localStorage
   - Direct API calls from browser to OpenAI
   - No backend required
   - Good for testing

2. **Cloudflare Worker Mode** (Production)
   - Serverless proxy deployed to Cloudflare Workers
   - Site owner's API key stored securely as Cloudflare secret
   - Users make requests to worker endpoint
   - Frictionless UX (no API key needed)
   - Current production URL: `https://hanuman-chalisa-api.arungupta.workers.dev`

### Testing Locally

**Option 1: User-Provided Key (Easiest)**

```bash
# Start Jekyll server
bundle exec jekyll serve

# Visit the guidance page
open http://localhost:4000/hanuman-chalisa/guidance

# Enter your OpenAI API key when prompted
# Get a key from: https://platform.openai.com/api-keys
```

**Option 2: Test with Cloudflare Worker**

If you have deployed the Cloudflare Worker, the site will automatically use it (no API key prompt shown).

```bash
# Check current mode in assets/js/guidance.js
grep "const WORKER_URL" assets/js/guidance.js

# If WORKER_URL is set (not empty), worker mode is active
# If WORKER_URL is empty, user-key mode is active
```

### Switching Modes

Edit `assets/js/guidance.js` (around line 30):

```javascript
// User-provided API key mode (for local testing)
const WORKER_URL = '';

// Cloudflare Worker mode (for production)
const WORKER_URL = 'https://hanuman-chalisa-api.arungupta.workers.dev';
```

Rebuild Jekyll after changing:
```bash
bundle exec jekyll serve
```

### Working with Embeddings

The guidance feature uses pre-computed verse embeddings for semantic search.

**Regenerating embeddings (when needed):**

```bash
# Option 1: Using HuggingFace (FREE, local)
./venv/bin/python scripts/generate_embeddings_local.py

# Option 2: Using OpenAI (requires API key in .env)
python scripts/generate_embeddings.py --provider openai

# Option 3: Pluggable script with provider selection
python scripts/generate_embeddings.py --provider huggingface
python scripts/generate_embeddings.py --provider openai
```

**When to regenerate:**
- Adding new language translations
- Updating verse content significantly
- Switching embedding providers (HuggingFace ↔ OpenAI)

**Output:**
- File: `embeddings.json` (4.2MB for OpenAI, 1.1MB for HuggingFace)
- Contains: Pre-computed embeddings for all 43 verses in English and Hindi

### Deploying Cloudflare Worker (For Maintainers)

**Quick automated deployment:**

```bash
./scripts/deploy-cloudflare-worker.sh
```

The script handles:
- Installing Wrangler CLI (if needed)
- Authenticating with Cloudflare
- Deploying the worker
- Setting API key as secret
- Testing the deployment
- Updating frontend configuration

**Manual deployment:**

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy worker
wrangler deploy

# Set OpenAI API key as secret
wrangler secret put OPENAI_API_KEY

# Test the worker
curl -X POST https://YOUR-WORKER-URL.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Say hello"}],
    "max_tokens": 50
  }'
```

**Update frontend to use worker:**

```bash
# Edit assets/js/guidance.js
# Set WORKER_URL to your deployed worker URL

# Commit and push
git add assets/js/guidance.js
git commit -m "Enable Cloudflare Worker"
git push
```

### Worker Files

- `cloudflare-worker.js` - Worker source code (API proxy)
- `wrangler.toml` - Cloudflare configuration
- `scripts/deploy-cloudflare-worker.sh` - Automated deployment script
- `docs/cloudflare-worker-setup.md` - Complete setup guide
- `docs/cloudflare-worker-deploy-cli.md` - CLI deployment guide
- `docs/api-modes.md` - Comparison of both modes

### Troubleshooting

**"Error: Failed to load verse embeddings"**
- Check if `embeddings.json` exists in project root
- Regenerate if missing: `./venv/bin/python scripts/generate_embeddings_local.py`

**"Error: OpenAI API quota exceeded"**
- Add credits at https://platform.openai.com/account/billing
- Or switch to user-key mode (set `WORKER_URL = ''`)

**"Error: CORS error when calling worker"**
- Check worker CORS headers allow your origin
- Edit `cloudflare-worker.js` line 13 to add your domain

**Worker not updating**
- Redeploy: `wrangler deploy`
- Check deployment: `wrangler tail` (view live logs)
- Verify secret is set: `wrangler secret list`

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

## Next Steps

- Set up automated tests
- Add link checker
- Configure GitHub Actions to run same validations

---

**Happy Developing!** May your builds be swift and your errors few. 🙏

**ॐ श्री हनुमते नमः**
