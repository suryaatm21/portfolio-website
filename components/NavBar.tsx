'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Socials } from '@/components/Socials';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigation } from '@/content/site';

const navItems = navigation;

export function NavBar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple scroll spy - find the section that's currently in view
      const sections = navItems.map((item) => item.href.slice(1));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm'
          : 'bg-transparent',
      )}
      role="navigation"
      aria-label="Main navigation">
      <div className="container mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#home')}
              className="text-2xl font-heading font-semibold text-brand-primary hover:text-brand-accent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Go to home section">
              Surya
            </motion.button>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(item.href)}
                    className={cn(
                      'text-xl font-medium transition-colors hover:text-brand-accent hover:bg-brand-accent/10 focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 px-3 py-2',
                      activeSection === item.href.slice(1)
                        ? 'text-brand-accent bg-brand-accent/10'
                        : 'text-brand-primary',
                    )}
                    aria-current={
                      activeSection === item.href.slice(1) ? 'page' : undefined
                    }>
                    {item.label}
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Right side - Socials and Mobile Menu */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              <Socials />
            </div>

            {/* Mobile menu button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden w-10 h-10 px-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle mobile menu">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            id="mobile-menu"
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(item.href)}
                    className={cn(
                      'w-full justify-start text-base font-medium transition-colors hover:text-brand-accent hover:bg-brand-accent/10 py-3',
                      activeSection === item.href.slice(1)
                        ? 'text-brand-accent bg-brand-accent/10'
                        : 'text-brand-primary',
                    )}
                    aria-current={
                      activeSection === item.href.slice(1) ? 'page' : undefined
                    }>
                    {item.label}
                  </Button>
                </motion.div>
              ))}
              <div className="pt-2 border-t border-border/50 mt-2">
                <Socials />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
