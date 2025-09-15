import twilio from 'twilio';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Use your own phone number for testing
    const testPhone = req.body.phone || '+1234567890'; // Replace with your number
    const testMessage = req.body.message || 'Test SMS from Kerr Detailing! This is working correctly. 🚗✨';

    console.log('Sending test SMS to:', testPhone);

    // Send test SMS
    const result = await client.messages.create({
      body: testMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: testPhone
    });

    console.log('Test SMS sent successfully:', result.sid);

    res.status(200).json({ 
      success: true, 
      messageId: result.sid,
      status: result.status,
      message: 'Test SMS sent successfully!',
      sentTo: testPhone
    });

  } catch (error) {
    console.error('Test SMS Error:', error);
    
    res.status(500).json({ 
      error: 'Failed to send test SMS',
      details: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
}
