import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar, Clock, User, Mail, Phone, Car, MessageSquare, CreditCard, X, CheckCircle, AlertCircle } from 'lucide-react';

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const formatService = (service) => {
    const serviceNames = {
      premium: 'Premium Package',
      diamond: 'Diamond Package',
      exterior: 'Exterior Detail',
      interior: 'Interior Clean',
      paint_correction: 'Paint Correction',
      ceramic_coating: 'Ceramic Coating',
      custom: 'Custom Service'
    };
    return serviceNames[service] || service;
  };

  const getServicePrice = (service) => {
    const servicePrices = {
      premium: 149,
      diamond: 249,
      exterior: 75,
      interior: 65,
      paint_correction: 200,
      ceramic_coating: 400,
      custom: 0
    };
    return servicePrices[service] || 0;
  };

  const formatAddons = (addonsJson) => {
    if (!addonsJson) return [];
    try {
      const addons = JSON.parse(addonsJson);
      const addonDetails = {
        engine_bay: { name: 'Engine Bay Cleaning', price: 35 },
        headlight_restoration: { name: 'Headlight Restoration', price: 45 },
        pet_hair_removal: { name: 'Pet Hair Removal', price: 25 },
        odor_elimination: { name: 'Odor Elimination', price: 40 },
        fabric_protection: { name: 'Fabric Protection', price: 30 },
        tire_dressing: { name: 'Premium Tire Dressing', price: 20 }
      };
      return addons.map(addonId => addonDetails[addonId] || { name: addonId, price: 0 });
    } catch {
      return [];
    }
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'succeeded': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const selectedAddons = formatAddons(booking.addons);
  const servicePrice = getServicePrice(booking.service);
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const calculatedTotal = servicePrice + addonsTotal;
  const displayTotal = booking.total_price || calculatedTotal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-w-[95vw] max-h-[95vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Booking Receipt</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status and Date */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <h3 className="font-semibold text-lg mb-2">Booking Status</h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                {booking.payment_status && (
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(booking.payment_status)}`}>
                    {booking.payment_status === 'succeeded' ? 'Paid' : 
                     booking.payment_status === 'failed' ? 'Payment Failed' : 
                     booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Booked on</p>
              <p className="font-semibold">{new Date(booking.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Service Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(booking.booking_date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{booking.booking_time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{booking.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{booking.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.phone}</p>
                </div>
              </div>
              
              {booking.car_make && (
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    <p className="font-medium">
                      {booking.car_year} {booking.car_make} {booking.car_model}
                      {booking.car_color && ` (${booking.car_color})`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Service Breakdown</h3>
            
            <div className="bg-muted/30 rounded-lg p-4">
              {/* Main Service */}
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <div>
                  <p className="font-medium">{formatService(booking.service)}</p>
                  <p className="text-sm text-muted-foreground">Base service</p>
                </div>
                <p className="font-semibold">${servicePrice}</p>
              </div>

              {/* Add-ons */}
              {selectedAddons.length > 0 && (
                <div className="py-2">
                  <p className="font-medium mb-2">Add-ons:</p>
                  {selectedAddons.map((addon, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 pl-4">
                      <p className="text-sm">{addon.name}</p>
                      <p className="text-sm font-medium">+${addon.price}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center py-3 border-t border-border/50 mt-2">
                <p className="text-lg font-bold">Total Amount:</p>
                <p className="text-xl font-bold text-primary">${displayTotal}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {booking.payment_status && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Payment Information</h3>
              
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Payment Status</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.payment_status === 'succeeded' ? 'Payment completed successfully' :
                     booking.payment_status === 'failed' ? 'Payment failed - please contact support' :
                     'Payment is being processed'}
                  </p>
                </div>
                <div className="ml-auto">
                  {booking.payment_status === 'succeeded' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : booking.payment_status === 'failed' ? (
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  ) : (
                    <Clock className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Special Notes */}
          {booking.message && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Special Notes</h3>
              
              <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Customer Message</p>
                  <p className="text-sm text-muted-foreground mt-1">{booking.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <Button onClick={onClose} className="w-full">
            Close Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
