'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { experience } from '@/content/site';
import { cn } from '@/lib/utils';

export function Timeline() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded(id);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-accent via-brand-secondary to-brand-accent opacity-30" />

      <div className="space-y-8">
        {experience.map((item, index) => {
          const isExpanded = expandedItems.includes(item.id);

          return (
            <div key={item.id} className="relative flex items-start gap-6">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={cn(
                    'w-16 h-16 rounded-full border-2 transition-all duration-200 hover:scale-110',
                    isExpanded
                      ? 'bg-brand-accent border-brand-accent text-white shadow-lg shadow-brand-accent/25'
                      : 'bg-background border-brand-accent/30 text-brand-accent hover:border-brand-accent hover:bg-brand-accent/10',
                  )}
                  aria-expanded={isExpanded}
                  aria-controls={`timeline-content-${item.id}`}>
                  <div className="text-center">
                    <div className="text-xs font-medium leading-tight">
                      {item.year}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3 mx-auto mt-0.5" />
                    ) : (
                      <ChevronRight className="h-3 w-3 mx-auto mt-0.5" />
                    )}
                  </div>
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <h3 className="text-lg font-heading font-semibold text-black">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-secondary font-medium">
                    {item.year}
                  </p>
                </div>

                {/* Expandable content */}
                <div
                  id={`timeline-content-${item.id}`}
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                  )}>
                  <Card className="soft-card mt-3">
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {item.bullets.map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            className="flex items-start gap-2 text-sm text-white/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
