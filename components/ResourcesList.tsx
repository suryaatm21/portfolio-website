'use client';

import { FadeInUp } from '@/components/animations/FadeInUp';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { ExternalLink } from 'lucide-react';

const resourceItems = [
  {
    title: 'System design cheatsheet',
    href: '#', // placeholder link
  },
  {
    title: 'Telegram job-tracker group',
    href: '#', // placeholder link
  },
  {
    title: 'More to come...',
    href: null,
    muted: true,
  },
];

export function ResourcesList() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="soft-card text-card-foreground p-8 sm:p-12" style={{ backgroundColor: `oklch(var(--card-opacity) 0 0)` }}>
        <FadeInUp>
          <header className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white mb-4">
              Resources
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Curated tools and resources to help you level up your development
              skills
            </p>
          </header>
        </FadeInUp>

        <div className="max-w-2xl mx-auto">
          <FadeInUp delay={0.1}>
            <ul className="space-y-4 mb-8">
              {resourceItems.map((item, index) => (
                <FadeInUp key={item.title} delay={0.15 + index * 0.05}>
                  <li className="flex items-center gap-3">
                    {/* Accent-colored bullet */}
                    <div className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white hover:text-brand-accent transition-colors underline underline-offset-4 decoration-brand-accent/30 hover:decoration-brand-accent flex items-center gap-1 group">
                        {item.title}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <span
                        className={
                          item.muted
                            ? 'text-white/60 italic'
                            : 'text-white'
                        }>
                        {item.title}
                      </span>
                    )}
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
                  href="https://resources.theuntab.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  Get access
                </a>
              </AnimatedButton>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
