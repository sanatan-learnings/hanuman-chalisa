# Deployment Guide

This guide covers deploying the Hanuman Chalisa website and its services.

## GitHub Pages (Static Site)

**Live Site:** [https://sanatan-learnings.github.io/hanuman-gpt/](https://sanatan-learnings.github.io/hanuman-gpt/)

### How It Works

The repository uses Jekyll with GitHub Pages to automatically generate the live site:

1. **Write content** in `_verses/*.md` as YAML front matter
2. **Push to GitHub** - Commit and push changes
3. **Auto-build** - GitHub runs Jekyll automatically
4. **Site is live** - Changes appear within 1-2 minutes

No manual build needed!

### Configuration

Key files:
- `_config.yml` - Jekyll configuration
- `_data/themes.yml` - Theme configuration
- `_layouts/` - Page templates
- `_verses/` - Verse content
- `assets/` - CSS, JavaScript, images

### Testing Locally

```bash
bundle exec jekyll serve
# View at http://localhost:4000/hanuman-gpt/
```

See [setup guide](setup.md) for detailed local development instructions.

## Cloudflare Worker (API Proxy)

Deploy a serverless proxy for OpenAI API requests, allowing spiritual guidance to work without users providing API keys.

### Benefits

- ✅ Keep GitHub Pages static hosting
- ✅ Secure - API key never exposed to users
- ✅ Fast - Cloudflare's global edge network
- ✅ Free tier - 100,000 requests/day
- ✅ Serverless - Auto-scaling, no maintenance

### Quick Deployment (SDK)

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install SDK
pip install verse-sdk

# Deploy
verse-deploy
```

The SDK handles authentication, deployment, and secret management automatically.

### Manual Deployment

**Prerequisites:**
- Cloudflare account: https://dash.cloudflare.com/sign-up
- OpenAI API key
- Node.js and Wrangler CLI

**Steps:**

1. **Create Worker:**
   ```bash
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```

2. **Add API Key Secret:**
   ```bash
   wrangler secret put OPENAI_API_KEY
   # Paste your OpenAI API key when prompted
   ```

3. **Get Worker URL:**
   - Find at https://dash.cloudflare.com/ → Workers & Pages
   - Format: `https://hanuman-chalisa-api.your-subdomain.workers.dev`

4. **Update Frontend:**
   Edit `assets/js/guidance.js`:
   ```javascript
   const WORKER_URL = 'https://your-worker-url.workers.dev';
   ```

5. **Test:**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev" \
     -H "Content-Type: application/json" \
     -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
   ```

6. **Deploy to GitHub:**
   ```bash
   git add assets/js/guidance.js
   git commit -m "Enable Cloudflare Worker for spiritual guidance"
   git push
   ```

### Worker Configuration

Worker code is in `workers/cloudflare-worker.js`.

Key features:
- CORS handling for GitHub Pages
- Request validation
- Rate limiting
- Error handling

### Monitoring

View logs and metrics:
```bash
wrangler tail
```

Or visit: https://dash.cloudflare.com/ → Workers & Pages → Your Worker → Metrics

## Troubleshooting

### GitHub Pages Build Failures

Check build status:
- Go to repository → Actions tab
- Look for Jekyll build errors
- Common issues: Invalid YAML, unsupported plugins

### Worker Not Responding

1. Check worker is deployed: `wrangler deployments list`
2. Verify secret is set: `wrangler secret list`
3. Check logs: `wrangler tail`
4. Validate CORS settings in worker code

### Changes Not Appearing

**GitHub Pages:**
- Wait 1-2 minutes for rebuild
- Check Actions tab for build status
- Clear browser cache (Cmd+Shift+R)

**Cloudflare Worker:**
- Changes are instant after `wrangler deploy`
- Clear Cloudflare cache if needed

## See Also

- [Setup Guide](setup.md) - Local development
- [Developer Guide](guide.md) - Full developer documentation
- [Spiritual Guidance Feature](../reference/spiritual-guidance.md)
