import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize clients
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Get test date from request, or use tomorrow by default
    const testDate = req.body.testDate || (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    })();

    console.log('Testing reminders for date:', testDate);

    // Get bookings for test date with text reminders enabled
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_date', testDate)
      .eq('text_reminders', true)
      .in('status', ['confirmed', 'pending']);

    if (error) {
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    console.log(`Found ${bookings?.length || 0} test bookings`);

    // If no bookings found, return info
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ 
        message: `No bookings found for ${testDate} with text reminders enabled`,
        testDate,
        suggestion: 'Create a test booking for tomorrow with text reminders enabled'
      });
    }

    const results = [];

    // Process each booking (but limit to 3 for testing)
    const testBookings = bookings.slice(0, 3);
    
    for (const booking of testBookings) {
      try {
        const appointmentDate = new Date(booking.booking_date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const message = `[TEST] Hi ${booking.name}! This is a test reminder for your car detailing appointment with Kerr Detailing scheduled for ${appointmentDate} at ${booking.booking_time}. This is just a test! 🧪`;

        // Send test SMS
        const smsResult = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: booking.phone
        });

        results.push({
          bookingId: booking.id,
          customerName: booking.name,
          phone: booking.phone,
          appointmentDate: booking.booking_date,
          appointmentTime: booking.booking_time,
          status: 'sent',
          messageId: smsResult.sid
        });

      } catch (smsError) {
        results.push({
          bookingId: booking.id,
          customerName: booking.name,
          phone: booking.phone,
          status: 'failed',
          error: smsError.message
        });
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length;
    const failureCount = results.filter(r => r.status === 'failed').length;

    res.status(200).json({
      message: 'Test reminder check completed',
      testDate,
      totalBookings: bookings.length,
      processedBookings: testBookings.length,
      successCount,
      failureCount,
      results
    });

  } catch (error) {
    console.error('Test function error:', error);
    res.status(500).json({ 
      error: 'Test failed',
      details: error.message 
    });
  }
}
