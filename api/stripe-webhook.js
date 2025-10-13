export default async function handler(req, res) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'GET') {
      // Stripe tests webhooks with GET requests
      return res.status(200).json({ 
        message: 'Webhook endpoint is active',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // For now, just log the webhook and return success
    console.log('Webhook received:', req.body);
    
    // Basic webhook processing without signature verification for testing
    const event = req.body;
    
    if (event && event.type) {
      console.log(`Received event: ${event.type}`);
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('Payment succeeded:', event.data?.object?.id);
          break;
        case 'payment_intent.payment_failed':
          console.log('Payment failed:', event.data?.object?.id);
          break;
        case 'payment_method.attached':
          console.log('Payment method attached:', event.data?.object?.id);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    }

    return res.status(200).json({ 
      received: true, 
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}