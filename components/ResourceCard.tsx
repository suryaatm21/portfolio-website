import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  href: string;
}

export function ResourceCard({ title, href }: ResourceCardProps) {
  const isComingSoon = href === '#';

  return (
    <Card className="soft-card group">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading text-black flex items-center justify-between">
          {title}
          {!isComingSoon && (
            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-accent" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isComingSoon ? (
          <Button variant="outline" disabled className="w-full bg-transparent">
            Coming Soon
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="w-full hover:bg-brand-accent hover:text-white border-brand-accent/20 bg-transparent">
            <a href={href} target="_blank" rel="noopener noreferrer">
              Access Resource
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
