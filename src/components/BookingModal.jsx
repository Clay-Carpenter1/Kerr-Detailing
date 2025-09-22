import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, AlertCircle, ArrowRight, X, Check, Plus, Minus, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAvailableTimeSlots } from '../lib/bookingUtils';
import { supabase } from '../lib/supabase';
import CarInfoModal from './CarInfoModal';
import PaymentModal from './PaymentModal';

const BookingModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [showCarInfo, setShowCarInfo] = useState(false);
  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
    service: '',
    addons: [],
    totalPrice: 0,
    textReminders: false
  });
  const [carInfo, setCarInfo] = useState({
    carMake: '',
    carModel: '',
    carYear: '',
    carColor: '',
    carCondition: 'good'
  });
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowCarInfo(false);
      setShowServiceSelection(false);
      setShowPayment(false);
      setError('');
      setSuccess(false);
      setPaymentData(null);
      setTimeSlots([]);
      setFormData({
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: '',
        date: '',
        time: '',
        message: '',
        service: '',
        addons: [],
        totalPrice: 0,
        textReminders: false
      });
      setCarInfo({
        carMake: '',
        carModel: '',
        carYear: '',
        carColor: '',
        carCondition: 'good'
      });
    }
  }, [isOpen, user]);

  // Check availability when date changes
  useEffect(() => {
    if (formData.date) {
      checkAvailability(formData.date);
    } else {
      setTimeSlots([]);
      setFormData(prev => ({ ...prev, time: '' }));
    }
  }, [formData.date]);

  const checkAvailability = async (selectedDate) => {
    setLoadingTimes(true);
    setFormData(prev => ({ ...prev, time: '' }));
    
    try {
      const { timeSlots: availableSlots, error } = await getAvailableTimeSlots(selectedDate);
      if (error) throw new Error(error);
      setTimeSlots(availableSlots);
    } catch (error) {
      console.error('Error checking availability:', error);
      setError('Failed to check time availability. Please try again.');
      setTimeSlots([]);
    } finally {
      setLoadingTimes(false);
    }
  };

  // Service packages with addons
  const servicePackages = [
    // {
    //   id: 'basic',
    //   name: 'Basic Package',
    //   price: 89,
    //   description: 'Perfect for regular maintenance',
    //   features: [
    //     'Exterior wash & dry',
    //     'Wheel cleaning',
    //     'Interior vacuum',
    //     'Dashboard wipe down',
    //     'Window cleaning'
    //   ]
    // },
    {
      id: 'premium',
      name: 'Premium Package',
      price: 149,
      description: 'Our most popular package',
      features: [
        'Clay bar treatment',
        'Paint polishing',
        'Leather conditioning',
        'Tire shine application',
        'Interior deep clean'
      ],
      popular: true
    },
    {
      id: 'diamond',
      name: 'Diamond Package',
      price: 249,
      description: 'The ultimate detailing experience',
      features: [
        'Everything in Premium',
        'Paint correction',
        'Ceramic coating application',
        'Engine bay cleaning',
        'Headlight restoration',
        'Paint protection warranty'
      ]
    }
  ];

  const addons = [
    {
      id: 'engine_bay',
      name: 'Engine Bay Cleaning',
      price: 35,
      description: 'Thorough cleaning and dressing of engine compartment'
    },
    {
      id: 'headlight_restoration',
      name: 'Headlight Restoration',
      price: 45,
      description: 'Restore clarity to foggy or yellowed headlights'
    },
    {
      id: 'pet_hair_removal',
      name: 'Pet Hair Removal',
      price: 25,
      description: 'Specialized removal of pet hair from upholstery'
    },
    {
      id: 'odor_elimination',
      name: 'Odor Elimination',
      price: 40,
      description: 'Professional treatment to eliminate persistent odors'
    },
    {
      id: 'fabric_protection',
      name: 'Fabric Protection',
      price: 30,
      description: 'Protective coating for interior fabrics and carpets'
    },
    {
      id: 'tire_dressing',
      name: 'Premium Tire Dressing',
      price: 20,
      description: 'High-quality tire shine and protection'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleServiceSelect = (serviceId) => {
    const selectedService = servicePackages.find(pkg => pkg.id === serviceId);
    setFormData(prev => ({
      ...prev,
      service: serviceId,
      addons: [], // Reset addons when service changes
      totalPrice: selectedService ? selectedService.price : 0
    }));
  };

  const handleAddonToggle = (addonId) => {
    const addon = addons.find(a => a.id === addonId);
    const currentAddons = formData.addons || [];
    const isSelected = currentAddons.includes(addonId);
    
    let newAddons;
    let priceChange;
    
    if (isSelected) {
      newAddons = currentAddons.filter(id => id !== addonId);
      priceChange = -addon.price;
    } else {
      newAddons = [...currentAddons, addonId];
      priceChange = addon.price;
    }
    
    setFormData(prev => ({
      ...prev,
      addons: newAddons,
      totalPrice: prev.totalPrice + priceChange
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!formData.date) {
      setError('Please select a date');
      return;
    }
    if (!formData.time) {
      setError('Please select a time');
      return;
    }

    // Check if selected time is still available
    const selectedTimeSlot = timeSlots.find(slot => slot.value === formData.time);
    if (!selectedTimeSlot || !selectedTimeSlot.available) {
      setError('Selected time slot is no longer available. Please choose another time.');
      return;
    }

    setShowCarInfo(true);
  };

  const handleServiceNext = () => {
    if (!formData.service) {
      setError('Please select a service package');
      return;
    }
    
    setShowPayment(true);
    setShowServiceSelection(false);
  };

  const completeBookingAfterPayment = async (paymentResult) => {
    setLoading(true);
    setError('');

    try {
      // Combine all booking data with payment info
      const completeBookingData = {
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        booking_date: formData.date,
        booking_time: formData.time,
        message: formData.message || null,
        car_make: carInfo.carMake,
        car_model: carInfo.carModel,
        car_year: parseInt(carInfo.carYear),
        car_color: carInfo.carColor || null,
        car_condition: carInfo.carCondition,
        addons: formData.addons ? JSON.stringify(formData.addons) : null,
        total_price: formData.totalPrice || 0,
        text_reminders: formData.textReminders,
        // Temporarily comment out until database is updated
        // payment_status: paymentResult.status,
        // payment_method_id: paymentResult.paymentMethodId,
        status: 'confirmed' // Change to confirmed since payment is complete
      };

      // Save booking to database
      const { data, error } = await supabase
        .from('bookings')
        .insert([completeBookingData])
        .select();

      if (error) throw error;

      console.log('Complete booking saved:', data);
      setPaymentData(paymentResult);
      setShowPayment(false);
      setSuccess(true);
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error saving booking:', error);
      setError(error.message || 'Failed to save booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCarInfoBack = () => {
    setShowCarInfo(false);
  };

  const handleCarInfoNext = (carInfoData) => {
    setCarInfo(carInfoData);
    setShowServiceSelection(true);
    setShowCarInfo(false);
  };

  const handleServiceBack = () => {
    setShowServiceSelection(false);
    setShowCarInfo(true);
  };

  const handlePaymentBack = () => {
    setShowPayment(false);
    setShowServiceSelection(true);
  };

  const handleCarInfoClose = () => {
    setShowCarInfo(false);
    setShowServiceSelection(false);
    setShowPayment(false);
    onClose();
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in to book a service.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              You need to be signed in to book a service.
            </p>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-4">
              Your booking has been saved successfully. We will contact you shortly to confirm your appointment.
            </p>
            <div className="bg-muted/30 p-4 rounded-lg text-left">
              <h3 className="font-semibold mb-2">Booking Details:</h3>
              <p className="text-sm text-muted-foreground">
                {carInfo.carYear} {carInfo.carMake} {carInfo.carModel}
                {carInfo.carColor && ` (${carInfo.carColor})`}
              </p>
              <p className="text-sm text-muted-foreground">
                {formData.date} at {formData.time}
              </p>
              <p className="text-sm text-muted-foreground">
                Total: ${formData.totalPrice}
              </p>
              {paymentData && (
                <p className="text-sm text-green-600 font-medium mt-2">
                  ✅ Payment Confirmed
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {/* Step 1: Basic Info Modal */}
      <Dialog open={isOpen && !showServiceSelection && !showCarInfo} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg w-full max-w-[95vw] max-h-[95vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle>Book Your Service - Step 1 of 3</DialogTitle>
            <DialogDescription>
              Fill out your contact information and select your preferred time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            <form onSubmit={handleNext} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={user && user.user_metadata?.full_name}
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={user && user.email}
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Text Message Opt-in
                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-md border border-border">
                  <input
                    type="checkbox"
                    name="textReminders"
                    id="textReminders"
                    checked={formData.textReminders}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-input rounded"
                  />
                  <label htmlFor="textReminders" className="text-sm text-foreground cursor-pointer">
                    <span className="font-medium">Send me text reminders</span>
                    <p className="text-muted-foreground mt-1">
                      Get a friendly text message reminder 24 hours before your detailing appointment. 
                      Standard message rates may apply.
                    </p>
                  </label>
                </div> */}
                
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  {/* Time Slot Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Time *
                      {loadingTimes && <span className="text-muted-foreground ml-2">(Checking availability...)</span>}
                    </label>
                    
                    {formData.date ? (
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => slot.available && setFormData(prev => ({ ...prev, time: slot.value }))}
                            disabled={!slot.available || loadingTimes}
                            className={`p-3 text-sm rounded-md border transition-colors flex items-center justify-between ${
                              formData.time === slot.value
                                ? 'bg-primary text-primary-foreground border-primary'
                                : slot.available
                                ? 'bg-background border-input hover:border-primary hover:bg-muted/50'
                                : 'bg-muted/30 border-muted text-muted-foreground cursor-not-allowed'
                            }`}
                          >
                            <span>{slot.label}</span>
                            {!slot.available && (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground p-2 border border-dashed border-muted rounded-md">
                        Please select a date first to see available times
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    name="message"
                    placeholder="Additional message or special requests..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none custom-scrollbar"
                  />
                </div>
              </div>
            </form>
          </div>
          
          <DialogFooter className="gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex items-center" 
              disabled={loadingTimes}
              onClick={handleNext}
            >
              Next: Vehicle Info
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step 3: Service Selection Modal */}
      <Dialog open={isOpen && showServiceSelection && !showCarInfo && !showPayment} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl w-full max-w-[95vw] max-h-[95vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle>Book Your Service - Step 3 of 4</DialogTitle>
            <DialogDescription>
              Choose your service package and add any extras you need.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
            {error && (
              <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Service Packages */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Your Package</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {servicePackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.service === pkg.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                      onClick={() => handleServiceSelect(pkg.id)}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                            Most Popular
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h4 className="text-lg font-semibold mb-1">{pkg.name}</h4>
                        <div className="text-2xl font-bold text-primary mb-2">${pkg.price}</div>
                        <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                        
                        <ul className="space-y-1 text-left">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <Check className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {formData.service === pkg.id && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons Section */}
              {formData.service && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Add Extras (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {addons.map((addon) => {
                      const isSelected = formData.addons?.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                              : 'border-border hover:border-primary/50 hover:bg-muted/30'
                          }`}
                          onClick={() => handleAddonToggle(addon.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{addon.name}</h4>
                                <span className="text-primary font-semibold">+${addon.price}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                            </div>
                            <div className="ml-3">
                              {isSelected ? (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Minus className="h-4 w-4 text-primary-foreground" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                                  <Plus className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Total Price Summary */}
              {formData.service && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Price:</span>
                    <span className="text-primary">${formData.totalPrice}</span>
                  </div>
                  {formData.addons?.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-2">
                      <div>Base package: ${servicePackages.find(p => p.id === formData.service)?.price}</div>
                      <div>Add-ons: +${formData.totalPrice - (servicePackages.find(p => p.id === formData.service)?.price || 0)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleServiceBack}>
              Back
            </Button>
            <Button 
              type="button" 
              className="flex items-center" 
              onClick={handleServiceNext}
              disabled={!formData.service}
            >
              Next: Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step 2: Car Info Modal */}
      <CarInfoModal
        isOpen={showCarInfo && !showServiceSelection && !showPayment}
        onClose={handleCarInfoClose}
        onBack={handleCarInfoBack}
        onNext={handleCarInfoNext}
        bookingData={formData}
      />

      {/* Step 4: Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={handleCarInfoClose}
        onBack={handlePaymentBack}
        onSuccess={completeBookingAfterPayment}
        bookingData={{
          ...formData,
          serviceName: servicePackages.find(pkg => pkg.id === formData.service)?.name || formData.service,
          carInfo: carInfo
        }}
      />
    </>
  );
};

export default BookingModal; 