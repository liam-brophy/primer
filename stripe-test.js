// Quick Stripe test to verify configuration
console.log('Testing Stripe configuration...');

// Check if we're using the right publishable key
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
console.log('Stripe Publishable Key:', publishableKey);

if (publishableKey && publishableKey.startsWith('pk_test_')) {
  console.log('✅ Using TEST publishable key - this is correct');
} else if (publishableKey && publishableKey.startsWith('pk_live_')) {
  console.log('❌ Using LIVE publishable key - this will reject test cards!');
} else {
  console.log('❌ Invalid or missing publishable key');
}

// Test card numbers that should work
const testCards = [
  '4242424242424242',
  '4000000000000002',
  '5555555555554444'
];

console.log('Valid test card numbers:', testCards);
