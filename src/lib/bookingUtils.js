import { supabase } from './supabase';

export const getAvailableTimeSlots = async (selectedDate) => {
  try {
    // Get all bookings for the selected date
    const { data: existingBookings, error } = await supabase
      .from('bookings')
      .select('booking_time')
      .eq('booking_date', selectedDate)
      .in('status', ['pending', 'confirmed']); // Only consider active bookings

    if (error) throw error;

    // All possible time slots - 2 hours apart
    const allTimeSlots = [
      { value: '9:00', label: '9:00 AM' },
      { value: '11:00', label: '11:00 AM' },
      { value: '13:00', label: '1:00 PM' },
      { value: '15:00', label: '3:00 PM' },
      { value: '17:00', label: '5:00 PM' }
    ];

    // Get booked time slots
    const bookedTimes = existingBookings?.map(booking => booking.booking_time) || [];

    // Mark availability for each time slot
    const timeSlots = allTimeSlots.map(slot => ({
      ...slot,
      available: !bookedTimes.includes(slot.value)
    }));

    return { timeSlots, error: null };
  } catch (error) {
    console.error('Error checking availability:', error);
    return { timeSlots: [], error: error.message };
  }
}; 