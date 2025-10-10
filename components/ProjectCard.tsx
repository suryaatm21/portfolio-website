"use client";

import { ExternalLink, Github, Eye } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ProjectCardProps {
  title: string;
  summary: string;
  repo: string;
  demo: string;
  tech: string[];
}

export function ProjectCard({
  title,
  summary,
  repo,
  demo,
  tech,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="soft-card group min-w-[320px] flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-heading text-black group-hover:text-brand-accent transition-colors">
            {title}
          </CardTitle>
          <p className="text-sm text-white/80 leading-relaxed">{summary}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tech badges */}
          <div className="flex flex-wrap gap-2">
            {tech.map((techItem) => (
              <Badge
                key={techItem}
                variant="secondary"
                className="text-xs bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                {techItem}
              </Badge>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 border-brand-primary/20 hover:bg-brand-primary hover:text-white bg-transparent">
              <a href={repo} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Repo
              </a>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 bg-brand-cta hover:bg-brand-cta-hover text-white">
                  <Eye className="mr-2 h-4 w-4" />
                  Demo
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-2xl">
                <SheetHeader>
                  <SheetTitle className="font-heading text-brand-primary">
                    {title}
                  </SheetTitle>
                  <SheetDescription>{summary}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {tech.map((techItem) => (
                      <Badge
                        key={techItem}
                        variant="secondary"
                        className="bg-brand-accent/10 text-brand-accent">
                        {techItem}
                      </Badge>
                    ))}
                  </div>

                  {/* Demo iframe or placeholder */}
                  <div className="border rounded-lg overflow-hidden bg-muted/30 aspect-video flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-white/70">Live demo preview</p>
                      <Button asChild variant="outline">
                        <a
                          href={demo}
                          target="_blank"
                          rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Live Demo
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 bg-transparent">
                      <a href={repo} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Source
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-brand-cta hover:bg-brand-cta-hover">
                      <a href={demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
