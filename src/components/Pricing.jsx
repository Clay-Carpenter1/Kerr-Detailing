import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import BookingModal from './BookingModal';
import { useState } from 'react';

const Pricing = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const packages = [
    // {
    //   name: 'Basic',
    //   price: '$89',
    //   description: 'Perfect for regular maintenance',
    //   features: [
    //     'Exterior wash & dry',
    //     'Wheel cleaning',
    //     'Interior vacuum',
    //     'Dashboard wipe down',
    //     'Window cleaning'
    //   ],
    //   popular: false
    // },
    {
      name: 'Premium',
      price: '$149',
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
      name: 'Diamond',
      price: '$249',
      description: 'The ultimate detailing experience',
      features: [
        'Everything in Premium',
        'Paint correction',
        'Ceramic coating application',
        'Engine bay cleaning',
        'Headlight restoration',
        'Paint protection warranty'
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pricing Packages</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect package for your vehicle's needs. All packages include our satisfaction guarantee.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`h-full ${pkg.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground">/service</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={pkg.popular ? 'default' : 'outline'}
                    onClick={() => setIsBookingOpen(true)}
                  >
                    Choose {pkg.name}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
};

export default Pricing;
