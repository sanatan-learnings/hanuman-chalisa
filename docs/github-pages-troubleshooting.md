# GitHub Pages Troubleshooting

## Current Issue: 404 Error

If you're getting a 404 error at https://arun-gupta.github.io/hanuman-chalisa/, here's how to fix it:

## Step 1: Enable GitHub Pages

GitHub Pages needs to be explicitly enabled for the repository.

### Enable via GitHub Website:

1. Go to https://github.com/arun-gupta/hanuman-chalisa
2. Click **Settings** (gear icon in the top navigation)
3. Scroll down and click **Pages** in the left sidebar
4. Under "Source", configure:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for the first build

### Verify It's Enabled:

After enabling, you should see a message like:
```
✓ Your site is live at https://arun-gupta.github.io/hanuman-chalisa/
```

## Step 2: Check Build Status

### Via GitHub Website:

1. Go to the repository: https://github.com/arun-gupta/hanuman-chalisa
2. Click the **Actions** tab
3. Look for "pages build and deployment" workflows
4. If any builds failed, click on them to see the error

### Common Build Issues:

**Issue: Jekyll build fails**
- Check `_config.yml` for syntax errors
- Verify all front matter in verse files is valid YAML
- Look at Actions logs for specific error messages

**Issue: 404 after build succeeds**
- Verify `baseurl` in `_config.yml` is set to `/hanuman-chalisa`
- Check that files are in the correct locations

**Issue: Images/audio not loading**
- Ensure paths start with `../` for relative links
- Verify files exist in the repository

## Step 3: Verify Configuration

Check `_config.yml` has correct settings:

```yaml
baseurl: "/hanuman-chalisa"
url: "https://arun-gupta.github.io"
```

**Important:** The `baseurl` must match your repository name.

## Step 4: Test Locally (Optional)

Before pushing, test locally to catch issues:

```bash
# Install Jekyll
gem install jekyll bundler

# Serve locally
jekyll serve

# Visit http://localhost:4000/hanuman-chalisa/
```

## Common 404 Causes

### 1. GitHub Pages Not Enabled
**Symptom:** 404 on entire site
**Fix:** Follow Step 1 above

### 2. Wrong Branch Selected
**Symptom:** 404, even though Pages is enabled
**Fix:** Settings → Pages → Change source to `main` branch

### 3. Build Failed
**Symptom:** Old content shows or 404
**Fix:** Check Actions tab for build errors

### 4. Baseurl Mismatch
**Symptom:** Homepage loads, but internal links 404
**Fix:** Verify `baseurl: "/hanuman-chalisa"` in `_config.yml`

### 5. First Build Delay
**Symptom:** 404 immediately after enabling
**Fix:** Wait 2-3 minutes, refresh

### 6. Cache Issue
**Symptom:** Changes don't appear
**Fix:** Hard refresh (Cmd/Ctrl + Shift + R)

## Verification Checklist

After enabling GitHub Pages, verify:

- [ ] Settings → Pages shows site is live
- [ ] Actions tab shows successful build (green checkmark)
- [ ] https://arun-gupta.github.io/hanuman-chalisa/ loads (may take 2-3 minutes)
- [ ] Home page shows verse navigation
- [ ] Click a verse - it loads correctly
- [ ] Arrow keys work for navigation
- [ ] Images load (once added to `/images/`)
- [ ] Audio players appear (once added to `/audio/`)

## Still Not Working?

### Check Repository Visibility

1. Go to repository Settings
2. Scroll to "Danger Zone"
3. Verify repository is **Public**
   - GitHub Pages free tier only works with public repos
   - If private, either make public or upgrade to GitHub Pro

### Force Rebuild

If builds are succeeding but site isn't updating:

1. Make a small change (add a space to README.md)
2. Commit and push
3. This triggers a new build

### Check GitHub Status

GitHub Pages might be experiencing issues:
- Visit https://www.githubstatus.com/
- Check "GitHub Pages" component status

## Getting Help

If you're still stuck:

1. Check the Actions tab for build error messages
2. Create an issue in the repository with:
   - The error message from Actions
   - Screenshot of Settings → Pages configuration
   - Browser console errors (F12 → Console tab)

## Expected Behavior

Once working, you should see:

```
🌐 https://arun-gupta.github.io/hanuman-chalisa/

├─ Home page with verse navigation
├─ /verses/doha_01 - Opening Doha 1
├─ /verses/doha_02 - Opening Doha 2
├─ /verses/verse_01 - Verse 1
├─ ... (verses 2-40)
└─ /verses/doha_closing - Closing Doha
```

With working:
- Arrow key navigation (← →)
- Mobile responsive layout
- Audio/image placeholders (until media added)

---

**Last Updated:** January 2026
