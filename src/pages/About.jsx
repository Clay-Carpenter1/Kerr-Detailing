import { motion } from 'framer-motion';
import { Award, Users, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const About = () => {
  const stats = [
    { icon: <Award className="h-8 w-8 text-primary" />, title: '5+ Years', description: 'Experience' },
    { icon: <Users className="h-8 w-8 text-primary" />, title: '1000+', description: 'Happy Customers' },
    { icon: <Clock className="h-8 w-8 text-primary" />, title: '24/7', description: 'Support' },
    { icon: <Shield className="h-8 w-8 text-primary" />, title: '100%', description: 'Satisfaction' },
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-2xl" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.8)'}}>About Kerr Detailing</h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              We are passionate about transforming vehicles into masterpieces through professional detailing services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2019, Kerr Detailing began as a passion project with a simple mission: 
                  to provide exceptional car detailing services that exceed customer expectations.
                </p>
                <p>
                  What started as a small operation has grown into a trusted name in automotive care, 
                  serving hundreds of satisfied customers throughout the region.
                </p>
                <p>
                  We believe that every vehicle deserves to look its best, and we're committed to 
                  using only the finest products and techniques to achieve outstanding results.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Car detailing workspace"
                className="rounded-lg shadow-xl border border-border"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">Why Choose Us</h2>
            <p className="text-xl text-muted-foreground">
              Numbers that speak for our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border"
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-2">{stat.title}</h3>
                <p className="text-muted-foreground">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
