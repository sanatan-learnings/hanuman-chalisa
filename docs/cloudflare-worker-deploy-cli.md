# Cloudflare Worker Deployment (CLI Method)

This guide uses the Wrangler CLI to deploy just the worker script. Your Jekyll site stays on GitHub Pages.

## Quick Setup (5 minutes)

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

Or if you prefer not to install globally:
```bash
npx wrangler --version  # Will use npx for commands below
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens your browser to authenticate.

### Step 3: Deploy the Worker

From your project root:

```bash
wrangler deploy
```

You'll see output like:
```
✨ Successfully published your script to
 https://hanuman-chalisa-api.xxxxx.workers.dev
```

**Copy this URL!** You'll need it in step 5.

### Step 4: Add Your OpenAI API Key

```bash
wrangler secret put OPENAI_API_KEY
```

When prompted, paste your OpenAI API key (starts with `sk-...`).

### Step 5: Update Frontend

Edit `assets/js/guidance.js` (around line 28):

```javascript
// Change from:
const WORKER_URL = '';

// To (use your URL from step 3):
const WORKER_URL = 'https://hanuman-chalisa-api.xxxxx.workers.dev';
```

### Step 6: Commit and Push

```bash
git add assets/js/guidance.js
git commit -m "Enable Cloudflare Worker for spiritual guidance"
git push
```

**Done!** Wait 1-2 minutes for GitHub Pages to rebuild, then test your site.

## Testing

Test the worker directly:

```bash
curl -X POST https://YOUR-WORKER-URL.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Say hello in Sanskrit"}],
    "max_tokens": 50
  }'
```

You should get a response!

## Updating the Worker

Made changes to `workers/cloudflare-worker.js`?

```bash
wrangler deploy
```

That's it! Changes are live instantly.

## Viewing Logs

```bash
wrangler tail
```

See live request logs as they happen.

## Managing Secrets

**List secrets:**
```bash
wrangler secret list
```

**Update API key:**
```bash
wrangler secret put OPENAI_API_KEY
```

**Delete secret:**
```bash
wrangler secret delete OPENAI_API_KEY
```

## Rollback (Emergency)

If something breaks:

```bash
# Option 1: Disable worker in frontend
# Edit assets/js/guidance.js:
const WORKER_URL = '';  # Empty = back to user-key mode

# Option 2: Delete the worker
wrangler delete hanuman-chalisa-api
```

## Common Issues

### "No account_id found"

**Fix:** Add to `wrangler.toml`:
```toml
account_id = "your-account-id"
```

Get it from: https://dash.cloudflare.com/ > Workers & Pages > Overview

### "Authentication error"

**Fix:**
```bash
wrangler logout
wrangler login
```

### "Module not found"

**Fix:** Make sure you're in the project root directory with `wrangler.toml`.

### Worker returns 500

**Check secret is set:**
```bash
wrangler secret list
```

Should show `OPENAI_API_KEY`.

## Comparison: CLI vs Dashboard

| Method | Pros | Cons |
|--------|------|------|
| **CLI** (this guide) | Fast, scriptable, version control | Requires Node.js |
| **Dashboard** (other guide) | No install, visual, beginner-friendly | Manual copy-paste |

Both work equally well! Choose what you prefer.

## Next Steps

- View metrics: https://dash.cloudflare.com/ > Workers > hanuman-chalisa-api > Metrics
- Set custom domain: https://dash.cloudflare.com/ > Workers > hanuman-chalisa-api > Settings > Triggers
- Restrict CORS: Edit `workers/cloudflare-worker.js` line 13 to your domain

---

**Questions?** See the [main setup guide](cloudflare-worker-setup.md) or open a GitHub issue.
