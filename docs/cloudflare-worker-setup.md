# Cloudflare Worker Setup Guide

This guide shows you how to deploy a Cloudflare Worker to proxy OpenAI API requests, allowing your GitHub Pages site to work without users providing their own API keys.

## Benefits

✅ **Keep GitHub Pages** - No need to migrate away from GitHub Pages
✅ **Secure** - API key never exposed to users or in browser
✅ **Fast** - Cloudflare's global edge network
✅ **Free tier** - 100,000 requests/day on free plan
✅ **No maintenance** - Serverless, auto-scaling

## Prerequisites

- Cloudflare account (free): https://dash.cloudflare.com/sign-up
- Your OpenAI API key

## Step-by-Step Deployment

### 1. Create Cloudflare Worker

1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages**
3. Click **Create Application**
4. Click **Create Worker**
5. Give it a name (e.g., `hanuman-chalisa-api`)
6. Click **Deploy**

### 2. Add Worker Code

1. After deployment, click **Edit Code**
2. Delete the default code
3. Copy the entire contents of `workers/cloudflare-worker.js` from your repo
4. Paste it into the editor
5. Click **Save and Deploy**

### 3. Add OpenAI API Key as Secret

1. Go back to your worker (Workers & Pages > your worker)
2. Click **Settings** tab
3. Click **Variables and Secrets**
4. Under "Environment Variables", click **Add variable**
5. Click **Encrypt** (to make it a secret)
6. Name: `OPENAI_API_KEY`
7. Value: Your OpenAI API key (starts with `sk-...`)
8. Click **Save**

### 4. Get Your Worker URL

1. Go to the worker overview page
2. Copy the worker URL (looks like: `https://hanuman-chalisa-api.your-subdomain.workers.dev`)
3. Test it works by running this in your terminal:

```bash
curl -X POST https://YOUR-WORKER-URL.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Say hello"}],
    "max_tokens": 50
  }'
```

You should get a response from OpenAI!

### 5. Update Frontend Code

1. Open `assets/js/guidance.js` in your repo
2. Find this line (around line 28):
   ```javascript
   const WORKER_URL = ''; // Leave empty to use user-provided API key mode
   ```
3. Update it with your worker URL:
   ```javascript
   const WORKER_URL = 'https://hanuman-chalisa-api.your-subdomain.workers.dev';
   ```
4. Save the file

### 6. Commit and Push

```bash
git add assets/js/guidance.js
git commit -m "Enable Cloudflare Worker for spiritual guidance"
git push
```

### 7. Test Your Site

1. Wait 1-2 minutes for GitHub Pages to rebuild
2. Visit your site: https://sanatan-learnings.github.io/hanuman-chalisa/guidance
3. The API key section should now be hidden!
4. Try asking a question - it should work without entering an API key

## Security Considerations

### Current Setup (Open Access)

The worker is currently configured with:
```javascript
'Access-Control-Allow-Origin': '*'
```

This allows **anyone** to use your worker. This is fine for:
- Testing
- Low-traffic sites
- Non-critical applications

### Recommended: Restrict to Your Domain

For production, restrict access to only your GitHub Pages domain:

1. Edit your worker code
2. Change this line:
   ```javascript
   'Access-Control-Allow-Origin': '*',
   ```
   To:
   ```javascript
   'Access-Control-Allow-Origin': 'https://sanatan-learnings.github.io',
   ```
3. Save and deploy

Now only requests from your site will work!

### Optional: Add Rate Limiting

The worker includes basic rate limiting (10 requests per minute per IP). To adjust:

1. Edit this section in the worker:
   ```javascript
   const RATE_LIMIT = {
     requests: 10,    // Max requests
     per: 60 * 1000,  // Per 60 seconds
   };
   ```
2. Adjust values as needed
3. Save and deploy

## Cost Estimation

**Cloudflare Workers Free Tier:**
- 100,000 requests/day
- 10ms CPU time per request
- More than enough for most sites!

**OpenAI Costs (same as before):**
- ~$0.01 per spiritual guidance query
- You control spending through OpenAI dashboard

**Paid Tier ($5/month):**
- 10 million requests/month
- Only needed if you get 333,000+ requests/day

## Monitoring

### View Worker Analytics

1. Go to your worker in Cloudflare dashboard
2. Click **Metrics** tab
3. See:
   - Requests per day
   - Error rate
   - CPU time usage
   - Success rate

### View OpenAI Usage

1. Go to https://platform.openai.com/usage
2. Monitor costs and usage patterns

## Troubleshooting

### Worker returns 500 error

**Check:**
1. Is `OPENAI_API_KEY` set in worker secrets?
2. Is the secret name exactly `OPENAI_API_KEY` (case-sensitive)?
3. Check worker logs: Workers & Pages > your worker > Logs

### CORS errors in browser

**Fix:**
1. Make sure worker code includes CORS headers
2. Check browser console for specific error
3. Verify worker URL is correct in `guidance.js`

### Rate limit errors

**Solutions:**
1. Increase rate limit in worker code
2. Check if someone is abusing your endpoint
3. Restrict CORS to your domain only

### API key quota exceeded

**Fix:**
1. Add credits at https://platform.openai.com/account/billing
2. Worker just proxies requests - billing is still on your OpenAI account

## Rollback (Emergency)

If something goes wrong, quickly disable the worker:

1. Open `assets/js/guidance.js`
2. Change:
   ```javascript
   const WORKER_URL = 'https://...';
   ```
   To:
   ```javascript
   const WORKER_URL = '';
   ```
3. Commit and push
4. Site reverts to user-provided API key mode

## Advanced: Custom Domain

Want to use your own domain (e.g., `api.hanumanchalisa.com`)?

1. Add domain to Cloudflare
2. Workers & Pages > your worker > Settings > Triggers
3. Add Custom Domain
4. Update `WORKER_URL` in `guidance.js`

## Questions?

- Cloudflare Workers docs: https://developers.cloudflare.com/workers/
- Need help? Open an issue in the GitHub repo

---

**Next Steps:**
- Follow steps 1-7 above
- Test your deployment
- Optionally: Restrict CORS to your domain
- Monitor usage in Cloudflare dashboard
