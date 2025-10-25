"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";

import { AnimatedButton } from "@/components/animations/AnimatedButton";
import { FloatingElement } from "@/components/animations/FloatingElement";
import { TextReveal } from "@/components/animations/TextReveal";
import { Button } from "@/components/ui/button";
import { hero } from "@/content/site";

export function Hero(): React.ReactElement {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-[80vh] md:min-h-[85vh] flex items-center justify-center relative overflow-visible">
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
            ease: "easeInOut",
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
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16">
            <FloatingElement variant="gentle" intensity={12}>
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl scale-125" />
                  <Image
                    src={hero.profileImage}
                    alt={hero.profileImageAlt}
                    width={256}
                    height={256}
                    priority
                    className="relative w-56 h-56 xl:w-64 xl:h-64 rounded-full object-cover border-2 border-accent/20 shadow-xl"
                  />
                </div>
              </motion.div>
            </FloatingElement>

            <div className="flex-1 text-center xl:text-left">
              <FloatingElement variant="subtle">
                <h1 className="text-5xl sm:text-6xl xl:text-7xl font-sans font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-slate-100 font-mono hero-name">
                    <TextReveal
                      mode="word"
                      preset="scale"
                      stagger={100}
                      duration={600}
                      threshold={0.1}>
                      {hero.name}
                    </TextReveal>
                  </span>
                </h1>
              </FloatingElement>

              <FloatingElement variant="subtle">
                <div className="inline-block mb-8 max-w-2xl xl:max-w-none readable-panel">
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-mono">
                    <TextReveal
                      mode="word"
                      preset="fadeUp"
                      stagger={50}
                      delay={400}
                      threshold={0.1}>
                      {hero.tagline}
                    </TextReveal>
                  </p>
                </div>
              </FloatingElement>

              <motion.div
                className="flex flex-col sm:flex-row items-center xl:items-start xl:justify-start justify-center gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}>
                <FloatingElement variant="subtle">
                  <AnimatedButton
                    size="lg"
                    onClick={() => scrollToSection("contact")}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-medium group shadow-lg hover:shadow-xl transition-shadow">
                    <span className="flex items-center">
                      {hero.cta.primary.text}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </AnimatedButton>
                </FloatingElement>

                <FloatingElement variant="subtle">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-border/50 text-foreground hover:bg-accent/10 px-8 py-3 text-base font-medium group">
                    <a
                      href={hero.cta.secondary.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center">
                      <ExternalLink className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                      {hero.cta.secondary.text}
                    </a>
                  </AnimatedButton>
                </FloatingElement>
              </motion.div>

              <motion.div
                className="flex items-center xl:justify-start justify-center gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}>
                <FloatingElement variant="subtle">
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
                </FloatingElement>
                <FloatingElement variant="subtle">
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
                </FloatingElement>
                <FloatingElement variant="subtle">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-black/10 hover:text-black text-black">
                    <a href="mailto:surya@theuntab.com" aria-label="Email">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                </FloatingElement>
              </motion.div>

              <motion.div
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}>
                <p className="text-sm font-medium text-secondary tracking-wide m-0">
                  Watch the clouds follow your cursor
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
