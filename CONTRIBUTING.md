# Contributing to Hanuman Chalisa Guide

Thank you for your interest in contributing to this devotional project! 🙏

## How to Contribute

### 1. Find or Suggest an Idea

- Browse [existing issues](https://github.com/arun-gupta/hanuman-chalisa/issues) for contribution ideas
- Suggest new ideas by [creating an issue](https://github.com/arun-gupta/hanuman-chalisa/issues/new)

### 2. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/hanuman-chalisa.git
cd hanuman-chalisa
```

### 3. Make Your Changes

Edit files using any text editor. Common contribution areas:

- **Content:** Improve translations, add context, fix typos
- **Media:** Create images or audio for verses
- **Documentation:** Enhance guides and documentation
- **Features:** Add new functionality (PDF export, search, etc.)

### 4. Test Your Changes

**For content changes:**
- Preview Markdown files in your editor
- Ensure Devanagari script displays correctly
- Verify YAML syntax is correct (no missing colons, proper indentation)

**For code/layout changes:**

Test locally before pushing - it catches build errors early!

```bash
# One-time setup
gem install bundler
bundle install

# Start local server
bundle exec jekyll serve

# Visit http://localhost:4000/hanuman-chalisa/
```

**Quick testing checklist:**
- [ ] All links work
- [ ] Language switcher (EN ↔ HI)
- [ ] Search functionality
- [ ] Print layout (Cmd/Ctrl+P)
- [ ] Mobile responsive
- [ ] No console errors (F12)

**→ For detailed setup, troubleshooting, and technical configuration, see:**
- **Jekyll setup:** [docs/local-development.md](docs/local-development.md)
- **Cloudflare Worker:** [docs/cloudflare-worker-setup.md](docs/cloudflare-worker-setup.md)
- **Technical overview:** [docs/developer-guide.md](docs/developer-guide.md)

### 5. Commit and Push

```bash
git add .
git commit -m "Brief description of your changes"
git push origin main
```

### 6. Create a Pull Request

- Go to your fork on GitHub
- Click "Pull Request"
- Describe your changes
- Submit for review

## Contribution Ideas

Here are some ways you can contribute:

### Content Improvements
- Fix typos or grammatical errors
- Improve word-by-word meanings
- Add or enhance stories behind verses
- Improve practical applications
- Add Ramayana citations where missing

### Translations
- **Add new languages** - [Tamil](https://github.com/arun-gupta/hanuman-chalisa/issues?q=is%3Aissue+is%3Aopen+label%3Atranslation+Tamil), [Telugu](https://github.com/arun-gupta/hanuman-chalisa/issues?q=is%3Aissue+is%3Aopen+label%3Atranslation+Telugu), [Spanish](https://github.com/arun-gupta/hanuman-chalisa/issues?q=is%3Aissue+is%3Aopen+label%3Atranslation+Spanish), or other languages
- **Translate UI strings** - Add new language file in `_data/translations/`
- Review and improve existing translations
- **Translation format:**
  ```yaml
  literal_translation:
    en: "English text..."
    hi: "हिन्दी अनुवाद..."
    ta: "தமிழ் மொழிபெயர்ப்பு..."
  ```
See [multilingual-implementation.md](docs/multilingual-implementation.md) for translation guide.

### Media Creation
- **Generate themed images** - Use DALL-E 3 to create new artistic themes (~$2 for 47 images). See [Developer Guide](docs/developer-guide.md#generate-custom-image-themes)
- Record human voice recitations
- Create regional language audio versions
- Design verse-specific illustrations

### Documentation
- Translate guides to other languages
- Add pronunciation guides for non-Hindi speakers
- Create video tutorials
- Write blog posts about the project

### Technical Features
- **Enhance book generator** - Add more customization options, cover page design
- **Improve spiritual guidance** - Add more verse context, improve retrieval accuracy
- Implement dark mode
- Add verse bookmarking
- Create mobile app version
- Add social sharing features
- Progressive Web App (PWA) with offline support
- Analytics integration (privacy-friendly)

### Accessibility
- Improve screen reader compatibility
- Add high contrast themes
- Enhance keyboard navigation
- Add audio descriptions

**See the [complete list of contribution ideas](https://github.com/arun-gupta/hanuman-chalisa/issues) in our issues.**

## Guidelines

### Content Quality
- Maintain respectful, devotional tone
- Verify accuracy of Sanskrit/Hindi translations
- Cite sources where applicable
- Keep explanations clear and accessible

### Code Quality
- Keep it simple - no unnecessary complexity
- Follow existing code style
- Comment your code where helpful
- Test before submitting

### File Naming
- Images: `verse_01.jpg`, `doha_01.jpg`
- Audio: `verse_01_full.mp3`, `verse_01_slow.mp3`
- Documents: Use kebab-case (e.g., `my-document.md`)

### Commit Messages
```
Brief description in present tense

- Bullet points for details
- What changed and why
- Keep under 72 characters per line

Co-Authored-By: Your Name <your.email@example.com>
```

## What to Avoid

❌ **Don't:**
- Make large changes without discussing first (create an issue)
- Change the core structure without approval
- Add dependencies without good reason
- Copy content from copyrighted sources
- Make theological claims without citations

✅ **Do:**
- Start small with documentation or content fixes
- Ask questions if unsure
- Be patient with the review process
- Respect the devotional nature of the project

## Getting Help

- **Questions?** [Open a discussion](https://github.com/arun-gupta/hanuman-chalisa/discussions)
- **Bug found?** [Create an issue](https://github.com/arun-gupta/hanuman-chalisa/issues/new)
- **Not sure?** Comment on an existing issue

## Code of Conduct

This is a devotional project. Please:
- Be respectful and kind
- Assume good intentions
- Welcome newcomers
- Keep discussions constructive
- Honor the sacred nature of the content

## Recognition

Contributors will be:
- Listed in commit history
- Mentioned in release notes for significant contributions
- Acknowledged in the project documentation

## Questions?

Feel free to reach out by:
- [Creating an issue](https://github.com/arun-gupta/hanuman-chalisa/issues/new)
- [Starting a discussion](https://github.com/arun-gupta/hanuman-chalisa/discussions)

---

_May your contributions be blessed by Lord Hanuman._ 🙏

**जय श्री राम | जय हनुमान**
