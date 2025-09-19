'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { ArrowRight, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Track mouse position for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isReducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x: x * 4, y: y * 4 });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-[80vh] md:min-h-[85vh] flex items-center justify-center relative overflow-hidden"
      onMouseMove={handleMouseMove}>
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16">
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: isReducedMotion ? 0 : mousePosition.x,
                y: isReducedMotion ? 0 : mousePosition.y,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl scale-125" />
                <img
                  src="https://i.imgur.com/0QUH8nY.jpg"
                  alt="Profile picture"
                  className="relative w-56 h-56 xl:w-64 xl:h-64 rounded-full object-cover border-2 border-accent/20 shadow-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('.jpg')) {
                      target.src = 'https://i.imgur.com/0QUH8nY.png';
                    } else {
                      target.src = '/diverse-group-profile.png';
                    }
                  }}
                />
              </div>
            </motion.div>

            <div className="flex-1 text-center xl:text-left">
              <motion.h1
                className="text-5xl sm:text-6xl xl:text-7xl font-sans font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}>
                <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-slate-100 font-mono hero-name">
                  Surya Atmuri
                </span>
              </motion.h1>

              <motion.div
                className="inline-block mb-8 max-w-2xl xl:max-w-none readable-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-mono">
                  Junior in cs @ georgia tech building solutions to real
                  problems. Currently scaling Untab and sharing recruitment
                  resources on LinkedIn 😁
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row items-center xl:items-start xl:justify-start justify-center gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}>
                <AnimatedButton
                  size="lg"
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-medium group shadow-lg hover:shadow-xl transition-shadow">
                  <a
                    href="mailto:surya@theuntab.com"
                    className="flex items-center">
                    Get in touch
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </AnimatedButton>

                <AnimatedButton
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-border/50 text-foreground hover:bg-accent/10 px-8 py-3 text-base font-medium group">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    See resume
                  </a>
                </AnimatedButton>
              </motion.div>

              <motion.div
                className="flex items-center xl:justify-start justify-center gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-black/10 hover:text-black text-black">
                  <a
                    href="https://github.com/suryaatm21"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-black/10 hover:text-black text-black">
                  <a
                    href="https://linkedin.com/in/surya-atmuri"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-black/10 hover:text-black text-black">
                  <a href="mailto:surya@theuntab.com" aria-label="Email">
                    <Mail className="h-5 w-5" />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}>
                <p className="text-sm font-medium text-secondary tracking-wide uppercase m-0">
                  Solve first, refine later.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
