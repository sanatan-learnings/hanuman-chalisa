# Cloudflare Worker Deployment Script

## Quick Start (5 minutes)

Run this single script to deploy the worker:

```bash
./scripts/deploy-cloudflare-worker.sh
```

That's it! The script handles everything automatically.

## What It Does

The script automatically:

1. ✅ Checks if Node.js is installed
2. ✅ Installs Wrangler CLI (if needed)
3. ✅ Authenticates with Cloudflare (if needed)
4. ✅ Deploys the worker to Cloudflare
5. ✅ Sets up your OpenAI API key as a secret
6. ✅ Tests the worker to verify it works
7. ✅ Updates `assets/js/guidance.js` with worker URL
8. ✅ Optionally commits and pushes changes to GitHub

**Interactive:** The script asks for confirmation before making changes.

## Prerequisites

- macOS, Linux, or Windows with Git Bash
- Node.js installed (https://nodejs.org/)
- Cloudflare account (free): https://dash.cloudflare.com/sign-up
- OpenAI API key: https://platform.openai.com/api-keys

## Example Run

```bash
$ ./scripts/deploy-cloudflare-worker.sh

==========================================
  Cloudflare Worker Deployment
  Hanuman Chalisa - OpenAI API Proxy
==========================================

ℹ️  Checking Node.js installation...
✅ Node.js is installed (v20.11.0)

ℹ️  Checking Wrangler CLI...
✅ Wrangler CLI is installed (3.84.1)

ℹ️  Checking Cloudflare authentication...
✅ Already authenticated with Cloudflare

ℹ️  Deploying worker to Cloudflare...

Total Upload: 2.45 KiB / gzip: 0.98 KiB
Uploaded hanuman-chalisa-api (1.23 sec)
Published hanuman-chalisa-api (0.28 sec)
  https://hanuman-chalisa-api.xxxxx.workers.dev

✅ Worker deployed successfully!
✅ Worker URL: https://hanuman-chalisa-api.xxxxx.workers.dev

ℹ️  Checking if OPENAI_API_KEY secret is set...
Would you like to set it now? (y/n): y

Enter the secret text you'd like assigned to OPENAI_API_KEY: [hidden]
✅ OPENAI_API_KEY secret set

ℹ️  Testing worker...
✅ Worker is working correctly!

ℹ️  Updating frontend configuration...
Would you like to update WORKER_URL in assets/js/guidance.js? (y/n): y
✅ Updated WORKER_URL in assets/js/guidance.js

Would you like to commit and push this change? (y/n): y
✅ Changes committed and pushed!

==========================================
  Deployment Complete!
==========================================

✅ Worker deployed and configured

ℹ️  Summary:
  • Worker URL: https://hanuman-chalisa-api.xxxxx.workers.dev
  • View metrics: https://dash.cloudflare.com/
  • View logs: wrangler tail
  • Redeploy: ./scripts/deploy-cloudflare-worker.sh
```

## Troubleshooting

### Permission denied when running script

```bash
chmod +x scripts/deploy-cloudflare-worker.sh
./scripts/deploy-cloudflare-worker.sh
```

### Node.js not installed

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install nodejs npm

# Fedora/RHEL
sudo dnf install nodejs npm
```

**Windows:**
Download from https://nodejs.org/

### Script fails with "Not logged in to Cloudflare"

The script will automatically prompt for login. Just follow the browser prompts.

Or manually login first:
```bash
wrangler login
```

### Worker deploys but doesn't work

**Check API key:**
```bash
wrangler secret list
```

Should show `OPENAI_API_KEY`. If not:
```bash
wrangler secret put OPENAI_API_KEY
```

**View logs:**
```bash
wrangler tail
```

Make a test request and watch the logs.

### Need to update API key

```bash
wrangler secret put OPENAI_API_KEY
```

## Re-running the Script

Safe to run multiple times! The script:
- Skips steps that are already done
- Asks before overwriting anything
- Won't commit if there are no changes

Use it to:
- Redeploy after updating `workers/cloudflare-worker.js`
- Update API key
- Get the worker URL again

## Manual Deployment (Without Script)

Prefer to do it manually? See:
- [docs/cloudflare-worker-deploy-cli.md](../docs/cloudflare-worker-deploy-cli.md) - CLI method
- [docs/cloudflare-worker-setup.md](../docs/cloudflare-worker-setup.md) - Dashboard method

## Uninstalling

**Remove worker:**
```bash
wrangler delete hanuman-chalisa-api
```

**Disable in frontend:**
```javascript
// In assets/js/guidance.js:
const WORKER_URL = '';  // Empty = user-key mode
```

Commit and push the change.

## Getting Help

- Script issues: Open issue on GitHub
- Cloudflare Workers docs: https://developers.cloudflare.com/workers/
- Wrangler CLI docs: https://developers.cloudflare.com/workers/wrangler/

---

**Pro tip:** After deployment, bookmark your worker URL and Cloudflare dashboard for easy access!
