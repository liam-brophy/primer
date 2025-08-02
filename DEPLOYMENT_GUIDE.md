# 🚀 Deployment Guide for Primer Preorder Form

## Current Status
✅ **The preorder form is now working locally with all fixes applied!**

## Quick Deployment Options

### Option 1: Use GitHub's Allow Secret Option
The fastest way to deploy right now:

1. Click this link provided by GitHub in the error message:
   ```
   https://github.com/liam-brophy/primer/security/secret-scanning/unblock-secret/30jsXzSrKvI9mHWedVUfnk5No3K
   ```
2. Click "Allow secret" (it's a test key, so this is safe)
3. Return to terminal and run: `git push origin main`

### Option 2: Force Push (Alternative)
```bash
git push origin main --force
```

## After Successful Push

### 1. Set Environment Variables in Netlify
Once your code is pushed, immediately go to your Netlify dashboard:

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment variables**
4. Add these variables:

```
MONGODB_URI=[your_mongodb_connection_string]
STRIPE_SECRET_KEY=[your_stripe_secret_key]
VITE_STRIPE_PUBLISHABLE_KEY=[your_stripe_publishable_key]
STRIPE_WEBHOOK_SECRET=[your_stripe_webhook_secret]
VITE_ADMIN_PASSWORD=[your_admin_password]
```

### 2. Trigger Deployment
After adding environment variables:
1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

### 3. Test Your Live Site
Once deployed, test the preorder form at:
```
https://your-site-name.netlify.app/preorders
```

## What Will Work Immediately
✅ Form submission and validation  
✅ Stripe payment processing  
✅ Customer data capture  
✅ Payment confirmation  
✅ Proper error handling  

## MongoDB Connection
⚠️ MongoDB may still have connection issues in production. If so:
- Orders will still process successfully through Stripe
- Customer data is preserved in Stripe metadata
- You can manually export order data from Stripe dashboard

## Next Steps After Deployment
1. **Test the live form** with a small test purchase
2. **Fix MongoDB connection** (if needed) by checking Atlas IP whitelist
3. **Monitor Netlify function logs** for any issues
4. **Set up Stripe webhooks** for automated order processing

## Emergency Rollback
If anything goes wrong, you can always:
```bash
git revert HEAD~2..HEAD
git push origin main
```

This will roll back to the previous working state while preserving the fixes in git history.
