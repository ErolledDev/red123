# 🚨 CRITICAL: AWS Amplify SSR Configuration Guide

Your Next.js app is working locally but AWS Amplify is treating it as static. Follow these steps EXACTLY:

## Step 1: Check Current Amplify Configuration

1. Go to AWS Amplify Console
2. Select your app
3. Go to "App settings" → "General"
4. Check the "App details" section

**❌ If you see:**
- Platform: "Web" 
- Framework: "React" or "Static"
- Build command: `npm run build && npm run export`

**✅ You need:**
- Platform: "Web"
- Framework: "Next.js - SSR"
- Build command: `npm run build`

## Step 2: Force SSR Detection

### Option A: Redeploy with Correct Settings
1. In Amplify Console → "App settings" → "Build settings"
2. Edit the build specification
3. Make sure it uses the `amplify.yml` from your repo
4. **CRITICAL**: Ensure build command is `npm run build` (NOT `npm run export`)

### Option B: Manual Override
If Amplify still detects it as static:

1. Go to "App settings" → "Environment variables"
2. Add these variables:
   ```
   AMPLIFY_NEXTJS_EXPERIMENTAL_TRACE=true
   AMPLIFY_DIFF_DEPLOY=false
   _LIVE_UPDATES=[]
   ```

3. Go to "App settings" → "Build settings"
4. Override build spec with:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
           - echo "NEXT_PUBLIC_BASE_URL=https://$AWS_BRANCH.$AWS_APP_ID.amplifyapp.com" >> .env.local
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

## Step 3: Verify SSR is Working

After deployment, test these URLs:

1. **API Test**: `https://your-app.amplifyapp.com/api/get-redirects`
   - ✅ Should return JSON data
   - ❌ If 404 = Still static deployment

2. **Admin Test**: `https://your-app.amplifyapp.com/admin`
   - ✅ Should load admin interface
   - ❌ If broken = Static deployment

3. **Create Test**: Try creating a redirect in admin
   - ✅ Should save and persist
   - ❌ If fails = File system not writable (static)

## Step 4: Common Issues & Solutions

### Issue: "API routes return 404"
**Cause**: Amplify is using static hosting
**Solution**: 
- Delete the app and recreate it
- Make sure to select "SSR" when prompted
- Or use the manual override above

### Issue: "Build succeeds but app is static"
**Cause**: Amplify auto-detected wrong framework
**Solution**:
- Add `AMPLIFY_NEXTJS_EXPERIMENTAL_TRACE=true` environment variable
- Redeploy

### Issue: "Cannot write to redirects.json"
**Cause**: File system is read-only (static hosting)
**Solution**: 
- Verify SSR is enabled
- Check build logs for "Next.js SSR" mentions

## Step 5: Nuclear Option - Recreate App

If nothing works:

1. **Delete current Amplify app**
2. **Create new app**
3. **When connecting repository, make sure:**
   - Framework detection shows "Next.js - SSR"
   - Build command is `npm run build`
   - Build output directory is `.next`
4. **Add environment variables:**
   ```
   AMPLIFY_NEXTJS_EXPERIMENTAL_TRACE=true
   NODE_VERSION=18
   ```

## Step 6: Verification Checklist

After deployment, verify:

- [ ] Build logs show "Next.js SSR" or "Server-side rendering"
- [ ] `/api/get-redirects` returns JSON (not 404)
- [ ] Admin panel loads and functions work
- [ ] Creating redirects saves to file system
- [ ] Dynamic routes work (e.g., `/your-slug`)
- [ ] Page source shows server-rendered meta tags

## Build Log Indicators

**✅ SSR Working:**
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**❌ Static Build:**
```
✓ Exporting static pages
✓ Export successful
```

## Emergency Contact

If you're still having issues:
1. Check the build logs in Amplify Console
2. Look for "SSR" or "server-side" mentions
3. Verify the `.next` directory contains server files
4. Test API routes immediately after deployment

---

**Remember**: This app REQUIRES SSR to function. Static deployment will break all dynamic features!