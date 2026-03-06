import React from "react";

import { FadeInUp } from "@/components/animations/FadeInUp";
import { FloatingElement } from "@/components/animations/FloatingElement";
import { TextReveal } from "@/components/animations/TextReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AcademicBackgroundCardProps {
  institution: string;
  degree: string;
  graduationDate: string;
  gpa: string;
  location?: string;
  className?: string;
}

export function AcademicBackgroundCard({
  institution,
  degree,
  graduationDate,
  gpa,
  location,
  className = "",
}: AcademicBackgroundCardProps): React.ReactElement {
  return (
    <FadeInUp className={className}>
      <FloatingElement variant="subtle">
        <Card className="tinted-glass overflow-hidden">
          <CardContent className="space-y-4 py-8 px-8">
            {/* Condensed two-line layout */}
            <div className="space-y-3 text-center">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2">
                <p className="text-lg font-medium" style={{ color: "#F6E05E" }}>
                  <TextReveal preset="fadeUp" stagger={40}>
                    {institution}
                  </TextReveal>
                </p>
                {location && (
                  <>
                    <span className="hidden sm:inline text-muted-foreground">
                      •
                    </span>
                    <p className="text-sm text-muted-foreground">
                      <TextReveal preset="fadeUp" stagger={40} delay={200}>
                        {location}
                      </TextReveal>
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-3 text-sm text-card-foreground">
                <TextReveal preset="fadeUp" stagger={30} delay={400} as="span">
                  {degree}
                </TextReveal>
                <span className="hidden sm:inline text-muted-foreground">
                  •
                </span>
                <TextReveal preset="fadeUp" stagger={30} delay={500} as="span">
                  {`GPA: ${gpa}`}
                </TextReveal>
                <span className="hidden sm:inline text-muted-foreground">
                  •
                </span>
                <TextReveal preset="fadeUp" stagger={30} delay={600} as="span">
                  {graduationDate}
                </TextReveal>
              </div>
            </div>

            {/* Centered CTA with emphasis */}
            <div className="pt-4 border-t border-border/40 text-center">
              <p className="text-sm font-medium text-brand-accent flex items-center justify-center gap-2">
                <span className="animate-bounce">↓</span>
                <TextReveal preset="fadeUp" stagger={50} delay={700} as="span">
                  Scroll and transition through my coursework to contact me!
                </TextReveal>
                <span className="animate-bounce">↓</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </FloatingElement>
    </FadeInUp>
  );
}
