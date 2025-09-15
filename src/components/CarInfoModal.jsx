import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Car, Calendar, Palette, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const CarInfoModal = ({ isOpen, onClose, bookingData, onBack, onNext }) => {
  const { user } = useAuth();
  const [carInfo, setCarInfo] = useState({
    carMake: '',
    carModel: '',
    carYear: '',
    carColor: '',
    carCondition: 'good'
  });
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const carMakes = [
    'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 
    'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep', 
    'Kia', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 
    'Nissan', 'Porsche', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
  ];

  const handleInputChange = (e) => {
    setCarInfo({
      ...carInfo,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    // Validate required car info fields
    if (!carInfo.carMake.trim()) {
      setError('Car make is required');
      return;
    }
    if (!carInfo.carModel.trim()) {
      setError('Car model is required');
      return;
    }
    if (!carInfo.carYear) {
      setError('Car year is required');
      return;
    }

    // Pass car info back to parent and proceed to service selection
    onNext(carInfo);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full max-w-[95vw] max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle>Vehicle Information - Step 2 of 3</DialogTitle>
          <DialogDescription>
            Tell us about your vehicle so we can provide the best service.
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
                <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  name="carMake"
                  value={carInfo.carMake}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Car Make *</option>
                  {carMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="carModel"
                  placeholder="Car Model (e.g., Camry, Accord) *"
                  value={carInfo.carModel}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  name="carYear"
                  value={carInfo.carYear}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Year *</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <Palette className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="carColor"
                  placeholder="Car Color (optional)"
                  value={carInfo.carColor}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vehicle Condition
                </label>
                <select
                  name="carCondition"
                  value={carInfo.carCondition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="excellent">Excellent - Like new</option>
                  <option value="good">Good - Well maintained</option>
                  <option value="fair">Fair - Some wear and tear</option>
                  <option value="poor">Poor - Needs attention</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        
        <DialogFooter className="gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit" onClick={handleNext}>
            Next: Select Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CarInfoModal; 