import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
// For testing, you can use Stripe's test keys
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_ACTUAL_KEY_HERE'
);

export default stripePromise;
