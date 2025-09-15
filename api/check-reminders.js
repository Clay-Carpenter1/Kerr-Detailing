import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

export default async function handler(req, res) {
  // Only allow POST requests (for security)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for server-side
    );

    // Initialize Twilio client
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format

    console.log('Checking for appointments on:', tomorrowDate);

    // Get all bookings for tomorrow where customers opted in for text reminders
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_date', tomorrowDate)
      .eq('text_reminders', true)
      .in('status', ['confirmed', 'pending']); // Only active bookings

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }

    console.log(`Found ${bookings?.length || 0} bookings for tomorrow with text reminders enabled`);

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ 
        message: 'No reminders to send',
        count: 0
      });
    }

    const results = [];

    // Send reminder for each booking
    for (const booking of bookings) {
      try {
        // Format the appointment date nicely
        const appointmentDate = new Date(booking.booking_date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Format time (convert 24hr to 12hr if needed)
        const appointmentTime = booking.booking_time;

        const message = `Hi ${booking.name}! This is a friendly reminder that your car detailing appointment with Kerr Detailing is scheduled for tomorrow (${appointmentDate}) at ${appointmentTime}. We look forward to making your vehicle shine! Reply STOP to opt out.`;

        // Send SMS
        const smsResult = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: booking.phone
        });

        results.push({
          bookingId: booking.id,
          customerName: booking.name,
          phone: booking.phone,
          status: 'sent',
          messageId: smsResult.sid
        });

        console.log(`Reminder sent to ${booking.name} (${booking.phone}): ${smsResult.sid}`);

      } catch (smsError) {
        console.error(`Failed to send reminder to ${booking.name}:`, smsError);
        results.push({
          bookingId: booking.id,
          customerName: booking.name,
          phone: booking.phone,
          status: 'failed',
          error: smsError.message
        });
      }
    }

    // Return summary
    const successCount = results.filter(r => r.status === 'sent').length;
    const failureCount = results.filter(r => r.status === 'failed').length;

    res.status(200).json({
      message: 'Reminder check completed',
      totalBookings: bookings.length,
      successCount,
      failureCount,
      results
    });

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
