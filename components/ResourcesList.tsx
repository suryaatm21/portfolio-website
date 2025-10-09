"use client";

import { ExternalLink, CheckCircle2 } from "lucide-react";

import { AnimatedButton } from "@/components/animations/AnimatedButton";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { sections, resources } from "@/content/site";

export function ResourcesList() {
  return (
    <div className="max-w-6xl mx-auto">
      <div
        className="soft-card text-card-foreground p-8 sm:p-12"
        style={{ backgroundColor: "oklch(var(--card-opacity) 0 0)" }}>
        <FadeInUp>
          <header className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white mb-4">
              {sections.resources.title}
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {sections.resources.description}
            </p>
          </header>
        </FadeInUp>

        <div className="max-w-2xl mx-auto">
          <FadeInUp delay={0.1}>
            <ul className="space-y-6 mb-8">
              {resources.map((item, index) => (
                <FadeInUp key={item.title} delay={0.15 + index * 0.05}>
                  <li className="flex items-start gap-3 p-4 rounded-lg bg-card/30 border border-border/30 hover:border-brand-accent/30 transition-colors">
                    {/* Status indicator */}
                    <CheckCircle2 className="h-5 w-5 text-brand-accent flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-brand-accent transition-colors font-medium flex items-center gap-2 group mb-1">
                        {item.title}
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-md bg-brand-accent/10 px-2 py-1 text-xs font-medium text-brand-accent border border-brand-accent/20">
                      Available
                    </span>
                  </li>
                </FadeInUp>
              ))}
            </ul>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="flex justify-center">
              <AnimatedButton
                asChild
                variant="cta"
                size="lg"
                className="shadow-lg">
                <a
                  href={sections.resources.buttonHref}
                  target="_blank"
                  rel="noopener noreferrer">
                  {sections.resources.buttonText}
                </a>
              </AnimatedButton>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
