import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Car, Sparkles, Shield, Droplets, Clock, Award, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import BookingModal from '../components/BookingModal';

const ServicesPage = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const servicePackages = [
    {
      name: 'Basic',
      price: '$89',
      description: 'Perfect for regular maintenance',
      duration: '2-3 hours',
      features: [
        'Exterior wash & dry',
        'Wheel cleaning',
        'Interior vacuum',
        'Dashboard wipe down',
        'Window cleaning',
        'Tire dressing'
      ],
      popular: false,
      color: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
    },
    {
      name: 'Premium',
      price: '$149',
      description: 'Our most popular package',
      duration: '3-4 hours',
      features: [
        'Everything in Basic',
        'Clay bar treatment',
        'Paint polishing',
        'Leather conditioning',
        'Interior deep clean',
        'Engine bay wipe down',
        'Chrome polishing'
      ],
      popular: true,
      color: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
    },
    {
      name: 'Elite',
      price: '$249',
      description: 'The ultimate detailing experience',
      duration: '4-6 hours',
      features: [
        'Everything in Premium',
        'Paint correction',
        'Ceramic coating application',
        'Engine bay cleaning',
        'Headlight restoration',
        'Paint protection warranty',
        'Premium interior protection'
      ],
      popular: false,
      color: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
    }
  ];

  const individualServices = [
    {
      icon: <Car className="h-12 w-12 text-primary" />,
      title: 'Exterior Detail',
      price: 'Starting at $75',
      description: 'Complete exterior washing, clay bar treatment, polishing, and waxing for a showroom finish.',
      features: ['Paint Decontamination', 'Clay Bar Treatment', 'Machine Polishing', 'Premium Wax Application']
    },
    {
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      title: 'Interior Clean',
      price: 'Starting at $65',
      description: 'Deep cleaning of all interior surfaces including leather conditioning and fabric protection.',
      features: ['Vacuum & Steam Clean', 'Leather Conditioning', 'Dashboard Treatment', 'Odor Elimination']
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: 'Paint Correction',
      price: 'Starting at $200',
      description: 'Professional paint correction to remove swirl marks, scratches, and restore paint clarity.',
      features: ['Swirl Mark Removal', 'Scratch Correction', 'Paint Enhancement', 'Clear Coat Restoration']
    },
    {
      icon: <Droplets className="h-12 w-12 text-primary" />,
      title: 'Ceramic Coating',
      price: 'Starting at $400',
      description: 'Long-lasting protection with ceramic coating technology for ultimate paint protection.',
      features: ['9H Hardness Protection', 'Hydrophobic Properties', '2-5 Year Warranty', 'UV Protection']
    }
  ];

  const addons = [
    { name: 'Engine Bay Cleaning', price: '$35', description: 'Thorough cleaning and dressing of engine compartment' },
    { name: 'Headlight Restoration', price: '$45', description: 'Restore clarity to foggy or yellowed headlights' },
    { name: 'Pet Hair Removal', price: '$25', description: 'Specialized removal of pet hair from upholstery' },
    { name: 'Odor Elimination', price: '$40', description: 'Professional treatment to eliminate persistent odors' },
    { name: 'Fabric Protection', price: '$30', description: 'Protective coating for interior fabrics and carpets' },
    { name: 'Premium Tire Dressing', price: '$20', description: 'High-quality tire shine and protection' }
  ];

  const whyChooseUs = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Expert Technicians',
      description: 'Certified professionals with years of experience'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Flexible Scheduling',
      description: 'Book appointments that fit your schedule'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Quality Guarantee',
      description: '100% satisfaction guarantee on all services'
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: 'Premium Products',
      description: 'Only the finest detailing products and equipment'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/darkened_overlay_stronger.png')`
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-2xl" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.8)'}}>Our Services</h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            Choose the perfect package for your vehicle's needs. All packages include our satisfaction guarantee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="pt-4 pb-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {servicePackages.map((pkg, index) => (
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
                
                <Card className={`h-full ${pkg.popular ? 'border-primary shadow-lg scale-105' : ''} relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-50`}></div>
                  <div className="relative z-10">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                      <CardDescription className="text-base">{pkg.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{pkg.price}</span>
                        <span className="text-muted-foreground">/service</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {pkg.duration}
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
                        Book {pkg.name} Package
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          </div>
      </section>

      {/* Individual Services */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Individual Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Need something specific? Choose from our individual detailing services.
            </p>
          </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {individualServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-primary font-semibold">{service.price}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      Book Service
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
              </div>
              </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Add-On Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enhance any package with these additional services for the ultimate detailing experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{addon.name}</h3>
                      <span className="text-primary font-bold text-lg">{addon.price}</span>
              </div>
                    <p className="text-muted-foreground text-sm">{addon.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
              </div>
            </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Kerr Detailing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference that professional care and attention to detail makes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Vehicle?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Book your appointment today and experience the difference professional detailing makes.
            </p>
            <Button 
              onClick={() => setIsBookingOpen(true)}
              size="lg" 
              variant="secondary"
              className="flex items-center space-x-2 mx-auto"
            >
              <span>Book Your Service Now</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default ServicesPage;
