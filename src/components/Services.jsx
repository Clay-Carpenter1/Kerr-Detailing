import { motion } from 'framer-motion';
import { Car, Sparkles, Shield, Droplets } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Car className="h-12 w-12 text-primary" />,
      title: 'Exterior Detail',
      description: 'Complete exterior washing, clay bar treatment, polishing, and waxing for a showroom finish.',
      features: ['Paint Decontamination', 'Clay Bar Treatment', 'Machine Polishing', 'Premium Wax Application']
    },
    {
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      title: 'Interior Clean',
      description: 'Deep cleaning of all interior surfaces including leather conditioning and fabric protection.',
      features: ['Vacuum & Steam Clean', 'Leather Conditioning', 'Dashboard Treatment', 'Odor Elimination']
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: 'Paint Correction',
      description: 'Professional paint correction to remove swirl marks, scratches, and restore paint clarity.',
      features: ['Swirl Mark Removal', 'Scratch Correction', 'Paint Enhancement', 'Clear Coat Restoration']
    },
    {
      icon: <Droplets className="h-12 w-12 text-primary" />,
      title: 'Ceramic Coating',
      description: 'Long-lasting protection with ceramic coating technology for ultimate paint protection.',
      features: ['9H Hardness Protection', 'Hydrophobic Properties', '2-5 Year Warranty', 'UV Protection']
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional car detailing services designed to keep your vehicle looking its absolute best.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="text-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-card-foreground">{service.title}</h3>
              <p className="text-muted-foreground mb-4 text-center text-sm leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
