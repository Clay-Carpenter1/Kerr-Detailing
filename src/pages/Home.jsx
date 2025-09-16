import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Home = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentBeforeAfter, setCurrentBeforeAfter] = useState(0);
  const navigate = useNavigate();

  const handleViewServices = () => {
    navigate('/services');
  };

  // Before/After gallery data
  const beforeAfterImages = [
    {
      id: 1,
      before: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Full Detail Package',
      description: 'Complete exterior and interior transformation'
    },
    {
      id: 2,
      before: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Paint Correction',
      description: 'Restored paint clarity and shine'
    },
    {
      id: 3,
      before: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Interior Deep Clean',
      description: 'Professional interior restoration'
    }
  ];

  // Customer reviews data
  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      text: 'Absolutely amazing service! My car looks brand new. The attention to detail is incredible and the team was so professional.',
      service: 'Premium Package',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      rating: 5,
      text: 'Best car detailing service in town! They transformed my old truck into something that looks like it just rolled off the lot.',
      service: 'Elite Package',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emily Chen',
      rating: 5,
      text: 'Professional, punctual, and perfect results. The ceramic coating has kept my car looking pristine for months!',
      service: 'Ceramic Coating',
      date: '3 months ago'
    },
    {
      id: 4,
      name: 'David Thompson',
      rating: 5,
      text: 'Incredible work on my luxury sedan. They treated it with such care and the results exceeded my expectations.',
      service: 'Paint Correction',
      date: '2 months ago'
    }
  ];

  const nextBeforeAfter = () => {
    setCurrentBeforeAfter((prev) => (prev + 1) % beforeAfterImages.length);
  };

  const prevBeforeAfter = () => {
    setCurrentBeforeAfter((prev) => (prev - 1 + beforeAfterImages.length) % beforeAfterImages.length);
  };

  return (
    <div>
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        ></div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-slate-900/30"></div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-2xl" style={{textShadow: '4px 4px 8px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.9)'}}>
            Welcome to 
            <span className="text-primary block drop-shadow-2xl font-black" style={{textShadow: '4px 4px 8px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.9)'}}>Kerr Detailing</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-xl" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.8), 1px 1px 3px rgba(0,0,0,0.9)'}}>
            Professional car detailing services that transform your vehicle into a masterpiece. 
            Experience the difference with our premium care and attention to detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 rounded-xl text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110 backdrop-blur-sm border-2 border-primary"
              style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}
            >
              Book Service
            </button>
            <button 
              onClick={handleViewServices}
              className="border-3 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-4 rounded-xl text-xl font-bold transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-2xl hover:shadow-3xl"
              style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}
            >
              View Services
            </button>
          </div>
        </div>
      </div>

      {/* Before/After Gallery Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">See the Transformation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Witness the incredible results of our professional detailing services
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              key={currentBeforeAfter}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              {/* Before Image */}
              <div className="relative">
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  BEFORE
                </div>
                <img
                  src={beforeAfterImages[currentBeforeAfter].before}
                  alt="Before detailing"
                  className="w-full h-80 object-cover rounded-lg shadow-xl"
                />
              </div>

              {/* After Image */}
              <div className="relative">
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  AFTER
                </div>
                <img
                  src={beforeAfterImages[currentBeforeAfter].after}
                  alt="After detailing"
                  className="w-full h-80 object-cover rounded-lg shadow-xl"
                />
              </div>
            </motion.div>

            {/* Gallery Info */}
            <div className="text-center mt-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {beforeAfterImages[currentBeforeAfter].title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {beforeAfterImages[currentBeforeAfter].description}
              </p>

              {/* Navigation Buttons */}
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevBeforeAfter}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                {/* Dots Indicator */}
                <div className="flex space-x-2">
                  {beforeAfterImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBeforeAfter(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentBeforeAfter ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextBeforeAfter}
                  className="rounded-full"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <Quote className="h-8 w-8 text-primary mb-4" />
                    
                    {/* Rating Stars */}
                    <div className="flex mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      "{review.text}"
                    </p>

                    {/* Customer Info */}
                    <div className="border-t pt-4">
                      <p className="font-semibold text-foreground">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.service}</p>
                      <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-muted-foreground mb-6">
              Ready to join our satisfied customers?
            </p>
            <Button 
              onClick={() => setIsBookingOpen(true)}
              size="lg"
              className="px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Book Your Detail Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default Home;
