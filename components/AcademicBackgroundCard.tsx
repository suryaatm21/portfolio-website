import React from "react";

import { CylindricalText } from "@/components/CylindricalText";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AcademicBackgroundCardProps {
  institution: string;
  degree: string;
  graduationDate: string;
  gpa: string;
  location?: string;
  coursework?: string[];
  className?: string;
}

export function AcademicBackgroundCard({
  institution,
  degree,
  graduationDate,
  gpa,
  location,
  coursework = [],
  className = "",
}: AcademicBackgroundCardProps): React.ReactElement {
  const hasCoursework = coursework.length > 0;

  return (
    <FadeInUp className={className}>
      <Card className="soft-card overflow-hidden">
        <CardHeader className="space-y-4 pb-6">
          <CardTitle className="text-xl font-heading font-semibold text-component-card-text">
            Academic Background
          </CardTitle>

          <div className="space-y-1">
            <p className="text-lg font-medium text-brand-accent">{institution}</p>
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

          {hasCoursework ? (
            <section className="space-y-6">
              <header className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  Relevant Coursework
                </h3>
                <p className="text-sm text-muted-foreground/80">
                  Scroll to explore the courses that shaped my CS foundation.
                </p>
              </header>

              <CylindricalText items={coursework} className="min-h-[70svh]" />
            </section>
          ) : null}
        </CardContent>
      </Card>
    </FadeInUp>
  );
}
