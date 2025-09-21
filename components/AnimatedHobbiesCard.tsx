'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FadeInUp } from '@/components/animations/FadeInUp';
import { hobbies } from '@/content/site';

export function AnimatedHobbiesCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % hobbies.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <FadeInUp delay={0.3}>
      <Card className="soft-card">
        <CardContent className="p-6">
          <h4 className="text-lg font-heading font-medium text-brand-accent mb-3">
            Find Me...
          </h4>

          <div className="relative h-20 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="absolute inset-0 flex items-center">
                <motion.span
                  className="text-2xl mr-3 flex-shrink-0"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}>
                  {hobbies[currentIndex].emoji}
                </motion.span>

                <motion.span
                  className={`text-base text-white font-medium flex-1 break-words ${
                    hobbies[currentIndex].color
                      ? `bg-gradient-to-r ${hobbies[currentIndex].color} bg-clip-text text-transparent`
                      : 'text-white'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}>
                  {hobbies[currentIndex].name}
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </FadeInUp>
  );
}
