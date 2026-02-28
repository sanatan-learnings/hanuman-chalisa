# Deployment Guide

This guide covers deploying the Hanuman Chalisa website and its services.

## GitHub Pages (Static Site)

**Live Site:** [https://hanumanji.ai/](https://hanumanji.ai/)

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
# View at http://localhost:4000/
```

See [setup guide](setup.md) for detailed local development instructions.

## Cloudflare Worker (API Proxy)

Deploy a serverless proxy for OpenAI chat and pluggable embeddings providers (OpenAI, Bedrock Cohere, Hugging Face) so users never need to provide keys.

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
pip install --upgrade sanatan-verse-sdk

# Inspect planned actions (no changes)
verse-deploy --dry-run

# Check currently deployed worker status
verse-deploy --status

# Deploy
verse-deploy
```

`verse-deploy` now supports:
- `--help` - Show usage
- `--status` - Show deployed worker URL/version/bindings
- `--dry-run` - Validate prerequisites and planned actions without deploying

Use `wrangler secret put ...` for multi-provider secrets (`HF_TOKEN`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, optional `AWS_SESSION_TOKEN`). The deploy flow validates/deploys and checks `OPENAI_API_KEY`.

### Manual Deployment

**Prerequisites:**
- Cloudflare account: https://dash.cloudflare.com/sign-up
- OpenAI API key (required for chat)
- AWS IAM credentials with Bedrock model access (required if runtime provider is Bedrock)
- Hugging Face token (required if runtime provider is Hugging Face)
- Node.js and Wrangler CLI

**Steps:**

1. **Create Worker:**
   ```bash
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```

2. **Add Worker Secrets:**
   ```bash
   wrangler secret put OPENAI_API_KEY
   wrangler secret put HF_TOKEN
   wrangler secret put AWS_ACCESS_KEY_ID
   wrangler secret put AWS_SECRET_ACCESS_KEY
   # Optional if using temporary credentials:
   wrangler secret put AWS_SESSION_TOKEN
   ```

3. **Set runtime vars (non-secret):**
   `wrangler.toml` already includes defaults:
   - `AWS_REGION = "us-east-1"`
   - `BEDROCK_EMBEDDING_MODEL = "cohere.embed-multilingual-v3"`

4. **Get Worker URL:**
   - Find at https://dash.cloudflare.com/ → Workers & Pages
   - Format: `https://hanumanji-api.your-subdomain.workers.dev`

5. **Update Frontend:**
   Edit `assets/js/guidance.js`:
   ```javascript
   const WORKER_URL = 'https://your-worker-url.workers.dev';
   ```

6. **Test Chat Path:**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev" \
     -H "Content-Type: application/json" \
     -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
   ```

7. **Test Embeddings Path (Bedrock):**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev" \
     -H "Content-Type: application/json" \
     -d '{"type":"bedrock_embeddings","model":"cohere.embed-multilingual-v3","input":"How do I overcome fear?"}'
   ```

8. **Deploy to GitHub:**
   ```bash
   git add assets/js/guidance.js
   git commit -m "Enable Cloudflare Worker for spiritual guidance"
   git push
   ```

### Enabling Bedrock In Production Runtime

1. Ensure Bedrock collection embeddings are generated under:
   - `data/embeddings/providers/bedrock-cohere-embed-multilingual-v3/collections/`
2. Set `_data/embeddings.yml`:
   - `active_provider: bedrock-cohere`
3. Deploy site + worker.
4. Validate `/guidance`:
   - Provider badge shows `bedrock-cohere`
   - Query succeeds without keyword-only fallback behavior
   - Worker returns 200 for `type: bedrock_embeddings` requests

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
5. For Bedrock mode, confirm:
   - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set
   - `AWS_REGION` matches enabled Bedrock region
   - IAM user/role has `bedrock:InvokeModel` permission for chosen model

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
