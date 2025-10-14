export default async function handler(req, res) {
  console.log('Payment intent API called');
  console.log('Environment check:', {
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7)
  });
  
  // Initialize Stripe only if we have the secret key
  let stripe = null;
  try {
    if (process.env.STRIPE_SECRET_KEY) {
      const Stripe = (await import('stripe')).default;
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
  } catch (error) {
    console.error('Stripe initialization error:', error);
    return res.status(500).json({ error: 'Stripe initialization failed', details: error.message });
  }
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: error.message || 'Payment intent creation failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
