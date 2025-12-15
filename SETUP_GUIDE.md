# Setup Guide for Primer Preorder Form

## The Issue
Users are experiencing "Failed to execute 'json' on 'Response': Unexpected end of JSON input" when submitting the preorder form. This occurs because:

1. **Missing Environment Variables**: The Netlify functions require Stripe and MongoDB credentials
2. **CORS Issues**: The serverless functions weren't properly configured for cross-origin requests
3. **Error Handling**: The frontend wasn't properly handling server errors

## Fixes Applied

### 1. Updated `create-payment-intent.js` function:
- Added proper CORS headers
- Added environment variable validation
- Improved error handling with proper JSON responses

### 2. Updated `PreordersPage.jsx`:
- Added better error handling for API responses
- Improved error message parsing

### 3. Created test function (`test-api.js`):
- For debugging API connectivity issues

## Required Environment Variables

You need to set these environment variables in your Netlify dashboard:

### Stripe Configuration:
- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_`)
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (starts with `pk_`)
- `STRIPE_WEBHOOK_SECRET`: Your webhook secret (starts with `whsec_`)

### MongoDB Configuration:
- `MONGODB_URI`: Your MongoDB connection string

### Site Configuration:
- `URL`: Your site URL (for production, this would be your domain)

## How to Set Environment Variables in Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" > "Environment variables"
4. Add each variable with its corresponding value

## Local Development Setup:

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Fill in your actual values
3. Use `netlify dev` to run the development server (installs functions locally)

## Testing the Fix:

1. Set up your environment variables
2. Deploy to Netlify or run `netlify dev` locally
3. Try submitting the preorder form
4. Check the browser console and Netlify function logs for any remaining issues

## Next Steps:

If you're still experiencing issues after setting up the environment variables:

1. Check the Netlify function logs in your dashboard
2. Verify your Stripe account is properly set up
3. Ensure your MongoDB cluster is accessible
4. Test with the `/api/test-api` endpoint first to verify basic connectivity

## Discount Codes

We've added support for a single reusable discount code:

- Code: `SPACE`
- Effect: Sets Primer Volume One unit price to $20.00 (from $23.99) and makes shipping free

To apply the discount, customers can enter the code in the "Discount Code" field on the preorder form. The backend validates the code server-side and adjusts pricing and shipping accordingly.
