const twilio = require('twilio');

module.exports = async function handler(req, res) {
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

    const { phone, customerName, appointmentDate, appointmentTime } = req.body;

    // Validate required fields
    if (!phone || !customerName || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ 
        error: 'Missing required fields: phone, customerName, appointmentDate, appointmentTime' 
      });
    }

    // Format the reminder message
    const message = `Hi ${customerName}! This is a friendly reminder that your car detailing appointment with Kerr Detailing is scheduled for tomorrow (${appointmentDate}) at ${appointmentTime}. We look forward to making your vehicle shine! Reply STOP to opt out.`;

    // Send the SMS
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log('SMS sent successfully:', result.sid);

    res.status(200).json({ 
      success: true, 
      messageId: result.sid,
      status: result.status
    });

  } catch (error) {
    console.error('SMS Error:', error);
    
    // Return appropriate error message
    if (error.code === 21211) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    } else if (error.code === 21608) {
      return res.status(400).json({ error: 'Phone number is not reachable' });
    } else {
      return res.status(500).json({ 
        error: 'Failed to send SMS reminder',
        details: error.message 
      });
    }
  }
}
