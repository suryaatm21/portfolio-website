"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { FadeInUp } from "@/components/animations/FadeInUp";
import { Card, CardContent } from "@/components/ui/card";
import { hobbies } from "@/content/site";

export function AnimatedHobbies() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % hobbies.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [hobbies.length]);

  return (
    <FadeInUp className="flex justify-center">
      <Card className="w-full max-w-sm overflow-hidden">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-heading font-medium text-gray-800 mb-6">
            Hobbies & Interests
          </h3>

          <div className="relative h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                  scale: { type: "spring", stiffness: 300 },
                }}
                className="absolute inset-0 flex flex-col items-center justify-center">
                {hobbies[currentIndex] && (
                  <>
                    <motion.div
                      className={`text-4xl mb-2 ${
                        hobbies[currentIndex]?.color
                          ? `bg-gradient-to-r ${hobbies[currentIndex]?.color} bg-clip-text text-transparent`
                          : ""
                      }`}
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}>
                      {hobbies[currentIndex]?.emoji}
                    </motion.div>

                    <motion.span
                      className="text-lg font-medium text-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}>
                      {hobbies[currentIndex]?.name}
                    </motion.span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {hobbies.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-green-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </FadeInUp>
  );
}
