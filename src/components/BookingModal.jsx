import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, AlertCircle, ArrowRight, ArrowLeft, X, Check, Plus, Minus, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAvailableTimeSlots } from '../lib/bookingUtils';
import { supabase } from '../lib/supabase';
import CarInfoModal from './CarInfoModal';
import PaymentModal from './PaymentModal';
import emailjs from '@emailjs/browser';

const BookingModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [showCarInfo, setShowCarInfo] = useState(false);
  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [showAddons, setShowAddons] = useState(false);
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
      setShowAddons(false);
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
      description: 'Complete interior and exterior transformation with professional-grade products and techniques',
      features: [
        'Foam Wash & Hand Wash',
        'Wheel Decontamination',
        'Tire Dressing',
        'Bug/Tar Removal',
        'Paint Enhancement',
        'Interior Decontamination',
        'Vacuum',
        'Fabric Shampoo',
        'Leather Conditioning',
        'Window Cleaning'
      ],
      popular: true
    },
    {
      id: 'diamond',
      name: 'Diamond Package',
      price: 199,
      description: 'Our most comprehensive service including engine bay cleaning and headlight restoration',
      features: [
        'Foam Wash & Hand Wash',
        'Wheel Decontamination',
        'Tire Dressing',
        'Bug/Tar Removal',
        'Clay Bar',
        'Engine Bay Cleaning',
        'Headlight Restoration',
        'Paint Enhancement',
        'Interior Decontamination',
        'Vacuum',
        'Fabric Shampoo',
        'Leather Conditioning',
        'Window Cleaning',
        'Trim Enhancement',
        'Odor Elimination'
      ]
    }
  ];

  const individualServices = [
    {
      id: 'Exterior Detail',
      name: 'Exterior Detail',
      price: 75,
      description: 'Complete exterior washing, clay bar treatment, polishing, and waxing for a showroom finish',
      features: [
        'Paint Decontamination',
        'Clay Bar Treatment',
        'Machine Polishing',
        'Premium Wax Application'
      ]
    },
    {
      id: 'Interior Clean',
      name: 'Interior Clean',
      price: 65,
      description: 'Deep cleaning of all interior surfaces including leather conditioning and fabric protection',
      features: [
        'Vacuum & Steam Clean',
        'Leather Conditioning',
        'Dashboard Treatment',
        'Odor Elimination'
      ]
    },
    {
      id: 'Paint Correction',
      name: 'Paint Correction',
      price: 200,
      description: 'Professional paint correction to remove swirl marks, scratches, and restore paint clarity',
      features: [
        'Swirl Mark Removal',
        'Scratch Correction',
        'Paint Enhancement',
        'Clear Coat Restoration'
      ]
    },
    {
      id: 'Ceramic Coating',
      name: 'Ceramic Coating',
      price: 400,
      description: 'Long-lasting protection with ceramic coating technology for ultimate paint protection',
      features: [
        '9H Hardness Protection',
        'Hydrophobic Properties',
        '2-5 Year Warranty',
        'UV Protection'
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
    const selectedService = servicePackages.find(pkg => pkg.id === serviceId) || 
                           individualServices.find(svc => svc.id === serviceId);
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
    
    setShowAddons(true);
    setShowServiceSelection(false);
  };

  const sendBookingEmail = async (bookingData, paymentResult) => {
    try {
      // Get service name
      const serviceName = servicePackages.find(pkg => pkg.id === bookingData.service)?.name || bookingData.service;
      
      // Get addon names
      const selectedAddons = addons.filter(addon => bookingData.addons.includes(addon.id));
      const addonsList = selectedAddons.length > 0 
        ? selectedAddons.map(addon => `${addon.name} (+$${addon.price})`).join('\n')
        : 'None';

      // Format booking date and time
      const bookingDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
      const formattedDate = bookingDateTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const formattedTime = bookingDateTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      // Email template parameters
      const templateParams = {
        customer_name: bookingData.name,
        customer_email: bookingData.email,
        customer_phone: bookingData.phone,
        service_name: serviceName,
        booking_date: formattedDate,
        booking_time: formattedTime,
        car_info: `${carInfo.carYear} ${carInfo.carMake} ${carInfo.carModel} (${carInfo.carColor})`,
        car_condition: carInfo.carCondition,
        addons: addonsList,
        total_price: `$${bookingData.totalPrice}`,
        special_requests: bookingData.message || 'None',
        text_reminders: bookingData.textReminders ? 'Yes' : 'No',
        payment_status: paymentResult?.status || 'Completed',
        to_email: 'kerrdetailin9@gmail.com'
      };

      // Send email using EmailJS (you'll need to set up the service and template)
      await emailjs.send(
        'service_kerr_detailing', // Service ID - needs to be created in EmailJS
        'template_booking_confirmation', // Template ID - needs to be created in EmailJS
        templateParams,
        'YOUR_PUBLIC_KEY' // Public key - needs to be replaced with actual key
      );

      console.log('Booking confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending booking email:', error);
      // Don't throw error to avoid disrupting the booking process
    }
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
        payment_status: paymentResult.status,
        payment_method_id: paymentResult.paymentMethodId,
        status: 'confirmed' // Change to confirmed since payment is complete
      };

      // Save booking to database
      const { data, error } = await supabase
        .from('bookings')
        .insert([completeBookingData])
        .select();

      if (error) throw error;

      console.log('Complete booking saved:', data);
      
      // Send booking confirmation email
      await sendBookingEmail(formData, paymentResult);
      
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

  const handleAddonsNext = () => {
    setShowPayment(true);
    setShowAddons(false);
  };

  const handleAddonsBack = () => {
    setShowAddons(false);
    setShowServiceSelection(true);
  };

  const handlePaymentBack = () => {
    setShowPayment(false);
    setShowAddons(true);
  };

  const handleCarInfoClose = () => {
    setShowCarInfo(false);
    setShowServiceSelection(false);
    setShowAddons(false);
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
      <Dialog open={isOpen && !showServiceSelection && !showCarInfo && !showAddons && !showPayment} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle>Book Your Service - Step 1 of 5</DialogTitle>
            <DialogDescription>
              Fill out your contact information and select your preferred time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 px-1 sm:px-0">
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
                    className="w-full pl-10 pr-3 py-3 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
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
                    className="w-full pl-10 pr-3 py-3 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
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
                    className="w-full pl-10 pr-3 py-3 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                      className="w-full pl-10 pr-3 py-3 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  {/* Time Slot Selection */}
                  {formData.date && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Select Time *
                        {loadingTimes && <span className="text-muted-foreground ml-2">(Checking availability...)</span>}
                      </label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => slot.available && setFormData(prev => ({ ...prev, time: slot.value }))}
                            disabled={!slot.available || loadingTimes}
                            className={`p-3 text-sm rounded-md border transition-colors flex items-center justify-center ${
                              formData.time === slot.value
                                ? 'bg-primary text-primary-foreground border-primary'
                                : slot.available
                                ? 'bg-background border-input hover:border-primary hover:bg-muted/50'
                                : 'bg-muted/30 border-muted text-muted-foreground cursor-not-allowed'
                            }`}
                          >
                            <span>{slot.label}</span>
                            {!slot.available && (
                              <X className="h-4 w-4 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {timeSlots.length === 0 && !loadingTimes && (
                        <p className="text-sm text-muted-foreground p-3 border border-dashed border-muted rounded-md text-center">
                          No available times for this date
                        </p>
                      )}
                    </div>
                  )}
                  
                  {!formData.date && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Select Time *
                      </label>
                      <p className="text-sm text-muted-foreground p-3 border border-dashed border-muted rounded-md text-center">
                        Please select a date first to see available times
                      </p>
                    </div>
                  )}
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
      <Dialog open={isOpen && showServiceSelection && !showCarInfo && !showAddons && !showPayment} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader className="pb-4 flex-shrink-0">
            <DialogTitle>Book Your Service - Step 3 of 5</DialogTitle>
            <DialogDescription>
              Choose a service package or individual service.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
            {error && (
              <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Service Packages */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Service Packages</h3>
                <div className="space-y-4">
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
                        <div className="absolute top-2 left-2">
                          <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                            Popular
                          </div>
                        </div>
                      )}
                      
                      <div className={`${pkg.popular ? 'mt-8' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold">{pkg.name}</h4>
                          <div className="text-xl font-bold text-primary">${pkg.price}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                        
                        <ul className="space-y-1 text-left">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-xs">
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

              {/* Individual Services */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Individual Services</h3>
                <div className="space-y-4">
                  {individualServices.map((service) => (
                    <div
                      key={service.id}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.service === service.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold">{service.name}</h4>
                          <div className="text-xl font-bold text-primary">Starting at ${service.price}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                        
                        <ul className="space-y-1 text-left">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-xs">
                              <Check className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {formData.service === service.id && (
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

            </div>
          </div>
          
          <DialogFooter className="gap-2 pt-4 border-t flex-shrink-0 mt-4">
            <Button type="button" variant="outline" onClick={handleServiceBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vehicle Info
            </Button>
            <Button 
              type="button" 
              className="flex items-center bg-primary hover:bg-primary/90 text-primary-foreground" 
              onClick={handleServiceNext}
              disabled={!formData.service}
            >
              {!formData.service ? 'Select a Package First' : 'Next: Add Extras'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step 4: Add-ons Modal */}
      <Dialog open={isOpen && showAddons && !showCarInfo && !showServiceSelection && !showPayment} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader className="pb-4 flex-shrink-0">
            <DialogTitle>Book Your Service - Step 4 of 5</DialogTitle>
            <DialogDescription>
              Add any extras you'd like (optional).
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
            {error && (
              <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Selected Package Summary */}
            {formData.service && (
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Selected Package</h3>
                <div className="flex justify-between items-center">
                  <span>{servicePackages.find(p => p.id === formData.service)?.name}</span>
                  <span className="font-semibold">${servicePackages.find(p => p.id === formData.service)?.price}</span>
                </div>
              </div>
            )}

            {/* Add-ons Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Add Extras (Optional)</h3>
                <div className="space-y-3">
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

              {/* Total Price Summary */}
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
            </div>
          </div>
          
          <DialogFooter className="gap-2 pt-4 border-t flex-shrink-0 mt-4">
            <Button type="button" variant="outline" onClick={handleAddonsBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Packages
            </Button>
            <Button 
              type="button" 
              className="flex items-center bg-primary hover:bg-primary/90 text-primary-foreground" 
              onClick={handleAddonsNext}
            >
              Continue to Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step 2: Car Info Modal */}
      <CarInfoModal
        isOpen={showCarInfo && !showServiceSelection && !showAddons && !showPayment}
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