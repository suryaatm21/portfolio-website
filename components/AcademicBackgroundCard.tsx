import React from "react";

import { FadeInUp } from "@/components/animations/FadeInUp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AcademicBackgroundCardProps {
  institution: string;
  degree: string;
  graduationDate: string;
  gpa: string;
  className?: string;
}

export function AcademicBackgroundCard({
  institution,
  degree,
  graduationDate,
  gpa,
  className = "",
}: AcademicBackgroundCardProps): React.ReactElement {
  return (
    <FadeInUp className={className}>
      <Card className="soft-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-heading font-semibold text-component-card-text mb-4">
            Academic Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-lg font-medium text-brand-accent">{institution}</p>
          <p className="text-card-foreground">{degree}</p>
          <p className="text-sm text-muted-foreground">
            Expected Graduation: {graduationDate}
          </p>
          <p className="text-sm text-muted-foreground">GPA: {gpa}</p>
        </CardContent>
      </Card>
    </FadeInUp>
  );
}
