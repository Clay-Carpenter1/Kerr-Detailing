import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, Mail, MessageSquare, User, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import BookingModal from '../components/BookingModal';
import BookingDetailsModal from '../components/BookingDetailsModal';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh bookings when a new booking is created
  const handleBookingClose = () => {
    setIsBookingOpen(false);
    // Refresh bookings list
    if (user) {
      fetchBookings();
    }
  };

  // Handle booking card click
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  // Handle details modal close
  const handleDetailsClose = () => {
    setIsDetailsOpen(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatService = (service, totalPrice) => {
    const serviceNames = {
      basic: 'Basic Package',
      premium: 'Premium Package',
      elite: 'Elite Package',
      exterior: 'Exterior Detail',
      interior: 'Interior Clean',
      paint_correction: 'Paint Correction',
      ceramic_coating: 'Ceramic Coating',
      custom: 'Custom Service'
    };
    const serviceName = serviceNames[service] || service;
    return totalPrice ? `${serviceName} - $${totalPrice}` : serviceName;
  };

  const formatAddons = (addonsJson) => {
    if (!addonsJson) return [];
    try {
      const addons = JSON.parse(addonsJson);
      const addonNames = {
        engine_bay: 'Engine Bay Cleaning',
        headlight_restoration: 'Headlight Restoration',
        pet_hair_removal: 'Pet Hair Removal',
        odor_elimination: 'Odor Elimination',
        fabric_protection: 'Fabric Protection',
        tire_dressing: 'Premium Tire Dressing'
      };
      return addons.map(addonId => addonNames[addonId] || addonId);
    } catch {
      return [];
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please Sign In</h1>
          <p className="text-muted-foreground">You need to be signed in to view your bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/darkened_overlay_stronger.png')`
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-slate-900/40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-2xl" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.8)'}}>My Bookings</h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-lg mb-8" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              View and manage your car detailing appointments
            </p>
            
            {/* New Booking Button - Centered */}
            <div className="flex justify-center">
              <Button
                onClick={() => setIsBookingOpen(true)}
                size="lg"
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}
              >
                <span>Book New Service</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bookings Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="text-center">
              <p className="text-muted-foreground">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-muted/30 rounded-lg p-12 max-w-md mx-auto">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Bookings Yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't made any bookings yet. Book your first service to get started!
                </p>
                
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-primary/50"
                    onClick={() => handleBookingClick(booking)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{formatService(booking.service, booking.total_price)}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {booking.booking_time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        {booking.name}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        {booking.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        {booking.phone}
                      </div>
                      
                      {/* Car Information */}
                      {booking.car_make && (
                        <div className="border-t pt-3 mt-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="font-medium mr-2">Vehicle:</span>
                            {booking.car_year} {booking.car_make} {booking.car_model}
                            {booking.car_color && ` (${booking.car_color})`}
                          </div>
                        </div>
                      )}
                      
                      {/* Add-ons Information */}
                      {booking.addons && formatAddons(booking.addons).length > 0 && (
                        <div className="border-t pt-3 mt-3">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium mr-2">Add-ons:</span>
                            <div className="mt-1">
                              {formatAddons(booking.addons).map((addon, idx) => (
                                <span key={idx} className="inline-block bg-muted px-2 py-1 rounded text-xs mr-1 mb-1">
                                  {addon}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Payment Status */}
                      {booking.payment_status && (
                        <div className="border-t pt-3 mt-3">
                          <div className="flex items-center text-sm">
                            <span className="font-medium mr-2">Payment:</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              booking.payment_status === 'succeeded' 
                                ? 'text-green-600 bg-green-100' 
                                : booking.payment_status === 'failed'
                                ? 'text-red-600 bg-red-100'
                                : 'text-yellow-600 bg-yellow-100'
                            }`}>
                              {booking.payment_status === 'succeeded' ? 'Paid' : 
                               booking.payment_status === 'failed' ? 'Failed' : 
                               booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                            </span>
                          </div>
                        </div>
                      )}

                      {booking.message && (
                        <div className="flex items-start text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-2 mt-0.5" />
                          <span className="break-words">{booking.message}</span>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground pt-2 border-t flex justify-between items-center">
                        <span>Booked on {new Date(booking.created_at).toLocaleDateString()}</span>
                        <span className="text-primary hover:text-primary/80 font-medium">Click for details →</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={handleBookingClose} />
      
      {/* Booking Details Modal */}
      <BookingDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={handleDetailsClose} 
        booking={selectedBooking} 
      />
    </div>
  );
};

export default Bookings; 