import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Camera, Star } from 'lucide-react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Button } from '../components/ui/button';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gallery images with categories
  const galleryImages = [
    {
      id: 1,
      src: '/images/gallery1.jpg',
      alt: 'Professional car detailing work',
      category: 'Featured',
      title: 'Professional Detail Work',
      description: 'Quality detailing service results'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Luxury car exterior detail',
      category: 'Exterior',
      title: 'Premium Exterior Detail',
      description: 'Complete paint correction and ceramic coating'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Car interior cleaning',
      category: 'Interior',
      title: 'Deep Interior Clean',
      description: 'Professional leather conditioning and fabric protection'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Paint correction work',
      category: 'Paint Correction',
      title: 'Paint Restoration',
      description: 'Swirl mark removal and paint enhancement'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Engine bay cleaning',
      category: 'Engine Bay',
      title: 'Engine Bay Detail',
      description: 'Thorough engine compartment cleaning'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Ceramic coating application',
      category: 'Ceramic Coating',
      title: 'Ceramic Protection',
      description: 'Long-lasting paint protection application'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Wheel and tire detail',
      category: 'Wheels',
      title: 'Wheel Restoration',
      description: 'Professional wheel cleaning and protection'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Complete car transformation',
      category: 'Full Detail',
      title: 'Complete Transformation',
      description: 'Full service detail package results'
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Headlight restoration',
      category: 'Restoration',
      title: 'Headlight Clarity',
      description: 'Restored headlight transparency'
    }
  ];

  const filteredImages = galleryImages;

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

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
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-2xl" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.8)'}}>Our Work Gallery</h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              See the incredible transformations and professional results from our detailing services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative group cursor-pointer"
                onClick={() => openLightbox(image, index)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white p-4">
                      <Camera className="h-8 w-8 mx-auto" />
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

          {/* Gallery Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16 p-8 bg-muted/30 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Cars Detailed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <p className="text-muted-foreground">Customer Satisfaction</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">4.6★</div>
                <p className="text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Navigation Buttons */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white hover:bg-black/70"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white hover:bg-black/70"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
                <div className="text-center">
                  <span className="text-sm text-gray-400">
                    {currentIndex + 1} of {filteredImages.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
