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
      <Card className="soft-card overflow-hidden">
        <CardHeader className="space-y-4 pb-6">
          <CardTitle className="text-xl font-heading font-semibold text-component-card-text">
            Academic Background
          </CardTitle>

          <div className="space-y-1">
            <p className="text-lg font-medium text-brand-accent">
              {institution}
            </p>
            {location ? (
              <p className="text-sm text-muted-foreground">{location}</p>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <dl className="grid gap-6 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="uppercase tracking-[0.3em] text-muted-foreground">
                Degree
              </dt>
              <dd className="text-base text-card-foreground">{degree}</dd>
            </div>

            <div className="space-y-1">
              <dt className="uppercase tracking-[0.3em] text-muted-foreground">
                Graduation
              </dt>
              <dd className="text-base text-card-foreground">
                {graduationDate}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="uppercase tracking-[0.3em] text-muted-foreground">
                GPA
              </dt>
              <dd className="text-base text-card-foreground">{gpa}</dd>
            </div>
          </dl>

          <div className="pt-4 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              Scroll below to explore my coursework through an interactive 3D
              experience
            </p>
          </div>
        </CardContent>
      </Card>
    </FadeInUp>
  );
}
