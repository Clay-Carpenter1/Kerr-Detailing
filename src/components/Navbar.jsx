import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Car, User, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import UserProfile from './auth/UserProfile';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  const primaryNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    ...(user ? [{ name: 'My Bookings', path: '/bookings' }] : []),
    { name: 'Gallery', path: '/gallery' },
  ];

  const secondaryNavItems = [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="bg-background sticky top-0 z-50 w-full border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Kerr Detailing</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              {/* Primary Navigation Items */}
              <div className="flex items-center space-x-6">
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Spacer */}
              <div className="w-px h-4 bg-border mx-6"></div>

              {/* Secondary Navigation Items */}
              <div className="flex items-center space-x-6">
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Auth Section */}
              <div className="flex items-center space-x-2 ml-6">
                {!loading && (
                  <>
                    {user ? (
                      <Button
                        onClick={() => setIsProfileOpen(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {user.user_metadata?.full_name?.split(' ')[0] || 'Profile'}
                        </span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setIsLoginOpen(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <LogIn className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign In</span>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {!loading && !user && (
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  variant="outline"
                  size="icon"
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              )}
              {!loading && user && (
                <Button
                  onClick={() => setIsProfileOpen(true)}
                  variant="outline"
                  size="icon"
                >
                  <User className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border/40">
                {/* Primary Navigation Items */}
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Divider for mobile */}
                <div className="border-t border-border/40 my-2"></div>
                
                {/* Secondary Navigation Items */}
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Auth Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export default Navbar; 