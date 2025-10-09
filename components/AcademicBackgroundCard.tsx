import React from "react";

import { FadeInUp } from "@/components/animations/FadeInUp";
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
      <Card className="soft-card overflow-hidden border-0 bg-transparent shadow-none">
        <CardContent className="space-y-4 p-6">
          {/* Condensed two-line layout */}
          <div className="space-y-2 text-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2">
              <p className="text-base font-medium text-brand-accent">
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

          {/* Centered CTA */}
          <div className="pt-2 text-center">
            <p className="text-xs text-muted-foreground/80 italic">
              ↓ Scroll to explore coursework in 3D
            </p>
          </div>
        </CardContent>
      </Card>
    </FadeInUp>
  );
}
