import React from "react";

import { FadeInUp } from "@/components/animations/FadeInUp";
import { FloatingElement } from "@/components/animations/FloatingElement";
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
        <Card className="soft-card overflow-hidden">
          <CardContent className="space-y-4 py-8 px-8">
          {/* Condensed two-line layout */}
                    <div className="space-y-3 text-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2">
              <p className="text-lg font-medium" style={{ color: "#F6E05E" }}>
                {institution}
              </p>
              {location && (
                <>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <p className="text-sm text-muted-foreground">{location}</p>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-3 text-sm text-card-foreground">
              <span>{degree}</span>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <span>GPA: {gpa}</span>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <span>{graduationDate}</span>
            </div>
          </div>

          {/* Centered CTA with emphasis */}
          <div className="pt-4 border-t border-border/40 text-center">
            <p className="text-sm font-medium text-brand-accent flex items-center justify-center gap-2">
              <span className="animate-bounce">↓</span>
              <span>Scroll to explore coursework in 3D</span>
              <span className="animate-bounce">↓</span>
            </p>
          </div>
        </CardContent>
      </Card>
      </FloatingElement>
    </FadeInUp>
  );
}
