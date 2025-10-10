"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 px-0 hover:bg-brand-accent/10 transition-colors">
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-brand-primary" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-brand-primary" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
